import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import path from 'path';

import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';

import { errorHandler } from "./middlewares/errorMiddleware";
import { setupAssociations } from './models';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(
    '/uploads',
    (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        next();
    },
    express.static(path.join(__dirname, '../public/uploads'))
);

setupAssociations();

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                error: 'File too large!',
            });
        }

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            error: err.message,
        });
    }

    if (err.message && err.message.includes('Only .png')) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            error: err.message,
        });
    }

    if (err.message && err.message.includes('PSD files are not allowed')) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            error: err.message,
        });
    }
    next(err);
});

app.use(errorHandler);

export default app;
