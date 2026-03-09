import React from 'react';
import {
    MapPin,
    Truck,
    Users,
    Shield,
    Heart,
    User,
    Calendar,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { GiCow } from 'react-icons/gi';

const Dashboard = () => {
    const stats = [
        {
            title: 'Sourcing Locations',
            value: '24',
            icon: <MapPin className="text-blue-500 opacity-60" size={40} />,
            link: '/locations'
        },
        {
            title: 'Animals Procured',
            value: '1,842',
            icon: <GiCow className="text-green-500 opacity-60" size={40} />,
            link: '/animals'
        },
        {
            title: 'Transporters',
            value: '45',
            icon: <Truck className="text-purple-500 opacity-60" size={40} />,
            link: '/transporters'
        },
        {
            title: 'Animal Suppliers',
            value: '156',
            icon: <Users className="text-orange-500 opacity-60" size={40} />,
            link: '/suppliers'
        },
        {
            title: 'Commission Agents',
            value: '32',
            icon: <Shield className="text-indigo-500 opacity-60" size={40} />,
            link: '/agents'
        },
        {
            title: 'Beneficiaries',
            value: '892',
            icon: <Heart className="text-pink-500 opacity-60" size={40} />,
            link: '/beneficiaries'
        },
        {
            title: 'Team Members',
            value: '48',
            icon: <User className="text-cyan-500 opacity-60" size={40} />,
            link: '/team'
        },
        {
            title: 'This Month\'s Procurement',
            value: '189',
            icon: <Calendar className="text-red-500 opacity-60" size={40} />,
            link: '/reports/monthly'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                        Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        Welcome to 360 Animal Parenting System
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 transition-colors duration-300">
                        <span className="flex items-center space-x-2">
                            <span>Refresh</span>
                            <ArrowRight size={16} />
                        </span>
                    </button>
                </div>
            </div>

            {/* Stats Grid - Clean design with only icon, value and title */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Link
                        key={index}
                        to={stat.link}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-start justify-between">
                            {stat.icon}
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                                    {stat.value}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                                    {stat.title}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;