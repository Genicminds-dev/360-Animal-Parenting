import React from 'react';
import {
    MapPin,
    Truck,
    Users,
    UserCircle,
    Shield,
    Heart,
    User,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Calendar,
    FileText,
    DollarSign
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

    const quickActions = [
        {
            title: 'Register Agents',
            description: 'Add new agents details',
            icon: <Users size={20} />,
            link: '/procurement/agent-registration',
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Register Sellers',
            description: 'Add new sellers details',
            icon: <Users size={20} />,
            link: '/procurement/seller-registration',
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Register Animal',
            description: 'Register new animal',
            icon: <GiCow size={20} />,
            link: '/procurement/animal-registration',
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'Health Check',
            description: 'Record health details',
            icon: <FileText size={20} />,
            link: '/procurement/health-checkup-List',
            color: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Process Payment',
            description: 'Make payment to farmer',
            icon: <DollarSign size={20} />,
            link: '/procurement/payment',
            color: 'from-yellow-500 to-yellow-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600">Welcome to 360 Animal Parenting System</p>
                </div>
                <div className="flex items-center space-x-4">
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-300">
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
                        className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex items-start justify-between">
                            {stat.icon}
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                <p className="text-gray-600">{stat.title}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions & Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                            <Link to="/procurement" className="text-primary-600 text-sm font-medium hover:text-primary-700">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {quickActions.map((action, index) => (
                                <Link
                                    key={index}
                                    to={action.link}
                                    className="group p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex flex-col items-center text-center space-y-3">
                                        <div className={`p-3 rounded-lg bg-gradient-to-br ${action.color} text-white`}>
                                            {action.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 group-hover:text-primary-600">{action.title}</h3>
                                            <p className="text-sm text-gray-500">{action.description}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Procurement Progress */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Procurement Progress</h2>
                <div className="space-y-6">
                    {[
                        { step: 1, title: 'Farmer Registration', progress: 95, count: 156 },
                        { step: 2, title: 'Animal Registration', progress: 85, count: 142 },
                        { step: 3, title: 'Health Check', progress: 75, count: 125 },
                        { step: 4, title: 'Price Approval', progress: 65, count: 108 },
                        { step: 5, title: 'Payment Processing', progress: 55, count: 92 },
                        { step: 6, title: 'Animal Transfer', progress: 45, count: 75 }
                    ].map((step) => (
                        <div key={step.step} className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 flex-1">
                                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-medium">
                                    {step.step}
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">{step.title}</h4>
                                    <p className="text-sm text-gray-500">{step.count} completed</p>
                                </div>
                            </div>
                            <div className="w-1/3">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                                        style={{ width: `${step.progress}%` }}
                                    ></div>
                                </div>
                                <div className="text-right mt-1">
                                    <span className="text-sm font-medium text-gray-700">{step.progress}%</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;