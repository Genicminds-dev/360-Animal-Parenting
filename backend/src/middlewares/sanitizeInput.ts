import { Request, Response, NextFunction } from 'express';

const validateUrlOrPath = (value: string): boolean => {
  if (value === '#') return true;
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return /^(https?:\/\/)[\w\-._~:/?#[\]@!$&'()*+,;=%]+$/i.test(value);
  }
  return /^\/[a-zA-Z0-9\-_/#&]*$/.test(value);
};

const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  if (!["POST", "PUT", "PATCH"].includes(req.method)) return next();
  if (req.headers['content-type']?.startsWith('multipart/form-data') && !req.body) return next();

  const errors: string[] = [];

const sanitizeField = (value: any, fieldName: string): string | false | any => {
  if (typeof value !== "string") return value;

  const urlFields = ['link', 'mainMenuLink', 'subLink', 'facebook', 'instagram', 'linkedin', 'twitter', 'videoLink'];
  const htmlAllowedFields = ['description', 'description1', 'description2'];

  const forbiddenTagsRegex = /<(script|iframe|img)\b[^>]*>/i;

  const encodedForbiddenTagsRegex = /&lt;\s*(script|iframe|img)[^&]*&gt;/i;

  const scriptTagRegex = /<\s*(script|iframe|src)\b[^>]*>|&lt;\s*(script|iframe|src)\s*&gt;/gi;
  
  const dangerousHtmlRegex = /<\/?[\w\s="/.':;#-\/\?]+>/gi;

  if (htmlAllowedFields.includes(fieldName)) {
    if (forbiddenTagsRegex.test(value) || encodedForbiddenTagsRegex.test(value)) {
      errors.push(`Invalid input in field ${fieldName}: <script>, <iframe>, <img> or their encoded versions are not allowed.`);
      return false;
    }
    return value;
  }

  if (urlFields.includes(fieldName)) {
    if (!validateUrlOrPath(value)) {
      errors.push(`Invalid URL or path in field ${fieldName}`);
      return false;
    }
    return value;
  }

  if (scriptTagRegex.test(value)) {
    errors.push(`Invalid input in field ${fieldName}: <script> tags are not allowed.`);
    return false;
  }

  if (dangerousHtmlRegex.test(value)) {
    errors.push(`Invalid input in field ${fieldName}: HTML tags are not allowed.`);
    return false;
  }

  return value;
};

  const sanitizeNestedMenus = (menus: any[]): any[] => {
    return menus.map(menu => ({
      name: sanitizeField(menu.name, 'name'),
      link: sanitizeField(menu.link, 'link'),
      nestedMenus: Array.isArray(menu.nestedMenus) ? sanitizeNestedMenus(menu.nestedMenus) : []
    }));
  };

  if (req.body) {
    for (const key in req.body) {
      const value = req.body[key];

      if (key === 'menuItems' && Array.isArray(value)) {
        req.body.menuItems = value.map((item: any) => ({
          ...item,
          mainMenu: sanitizeField(item.mainMenu, 'mainMenu'),
          mainMenuLink: sanitizeField(item.mainMenuLink, 'mainMenuLink'),
          subMenus: Array.isArray(item.subMenus) ? sanitizeNestedMenus(item.subMenus) : []
        }));
      } else if (key === 'subMenus' && Array.isArray(value)) {
        req.body.subMenus = sanitizeNestedMenus(value);
      } else {
        req.body[key] = sanitizeField(value, key);
      }
    }
  }

  if (errors.length > 0) {
    res.status(400).json({
      success: false,
      message: "Security validation failed",
      errors,
    });
    return;
  }

  next();
};

export default sanitizeInput;
