import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../config/api';
import AuthContext from '../context/AuthContext';
import { AlertTriangle, BadgeCheck, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const PaymentPage = () => {
    const [searchParams] = useSearchParams();
    const { user } = useContext(AuthContext);
    const internshipId = searchParams.get('internshipId');

    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [duration, setDuration] = useState('4');
    const [certificateName, setCertificateName] = useState(user?.name || '');
    const [utr, setUtr] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [paymentOptions, setPaymentOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [success, setSuccess] = useState(false);
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotUrl, setScreenshotUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const APPLICATION_FEE = 149;

    useEffect(() => {
        if (!internshipId) {
            setError('No internship selected. Please go back and choose an internship.');
            setLoading(false);
            return;
        }
        const fetchInternship = async () => {
            try {
                const res = await api.get(`/internships/public/${internshipId}`);
                setInternship(res.data.data);
            } catch (err) {
                setError('Could not load internship details. It might be closed or invalid.');
            } finally {
                setLoading(false);
            }
        };
        fetchInternship();
        api.get('/payment-options').then(res => {
            const activeOptions = res.data.data.filter(option => option.isActive !== false);
            setPaymentOptions(activeOptions);
            setSelectedOption(activeOptions[0] || null);
        });
    }, [internshipId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            // 1. Upload screenshot and get URL
            const formData = new FormData();
            formData.append('paymentScreenshot', screenshot);
            const uploadRes = await api.post('/applications/upload-payment-screenshot', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            const screenshotUrl = uploadRes.data.url;
            setUploading(false);
            // 2. Create application with screenshot URL
            await api.post('/applications', {
                internshipId,
                duration,
                certificateName,
                utr,
                paymentScreenshot: screenshotUrl,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not submit application.');
            setUploading(false);
        }
        setIsSubmitting(false);
    };

    const handleScreenshotChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setScreenshot(file);
        setScreenshotUrl(URL.createObjectURL(file));
    };

    console.log("PaymentPage rendered", { internshipId, loading, error, internship });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex justify-center items-center font-sans">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col justify-center items-center text-center p-6 font-sans">
                <div className="bg-white/80 dark:bg-gray-900/80 p-8 rounded-2xl shadow-2xl max-w-sm w-full backdrop-blur-md border border-indigo-100">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link to="/internships" className="w-full inline-flex justify-center items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded-md hover:from-indigo-600 hover:to-pink-600 font-semibold transition-all">Browse Internships</Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col justify-center items-center text-center p-6 font-sans">
                <div className="bg-white/80 dark:bg-gray-900/80 p-8 rounded-2xl shadow-2xl max-w-sm w-full backdrop-blur-md border border-green-200 animate-fade-in">
                    <BadgeCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
                    <p className="text-gray-600 mb-6">Your application and payment details have been submitted successfully.</p>
                    <Link to="/dashboard/applied-internships" className="w-full inline-flex justify-center items-center px-4 py-2 bg-gradient-to-r from-green-500 to-indigo-500 text-white rounded-md hover:from-green-600 hover:to-indigo-600 font-semibold transition-all">Go to My Applications</Link>
                </div>
            </div>
        );
    }

    if (!loading && !error && !internship) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 font-sans">
                <div className="bg-white/80 dark:bg-gray-900/80 p-8 rounded-2xl shadow-2xl text-center backdrop-blur-md border border-indigo-100">
                    <p className="text-lg text-gray-700">No internship data found. Please try again later.</p>
                    <Link to="/internships" className="mt-4 inline-block px-4 py-2 bg-gradient-to-r from-indigo-500 to-pink-500 text-white rounded hover:from-indigo-600 hover:to-pink-600 transition-all">Browse Internships</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-4 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
                <div className="bg-white bg-opacity-95 p-8 rounded-2xl shadow-2xl mb-8">
                    <h2 className="text-center text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        Apply for {internship?.title}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <span className="font-bold text-indigo-800">Company:</span>
                                <span className="text-gray-700">{internship?.company}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="font-bold text-indigo-800">Location:</span>
                                <span className="text-gray-700">{internship?.location}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="font-bold text-indigo-800">Stipend:</span>
                                <span className="text-gray-700">₹{internship?.stipend}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <span className="font-bold text-indigo-800">Duration:</span>
                                <span className="text-gray-700">{internship?.duration}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="font-bold text-indigo-800">Technologies:</span>
                                <span className="text-gray-700">{internship?.technologies?.join(', ')}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
                        <span className="font-bold text-indigo-800 text-xl">Description:</span>
                        <p className="text-gray-700 text-lg leading-relaxed mt-2">{internship?.description}</p>
                    </div>
                </div>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white/80 dark:bg-gray-900/80 py-8 px-4 shadow-2xl rounded-2xl sm:px-10 backdrop-blur-md border border-indigo-100 animate-fade-in">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" value={user?.name || ''} readOnly className="mt-1 block w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Certificate Name <span className="text-xs text-gray-400">(as you want it on your certificate)</span></label>
                            <input type="text" value={certificateName} onChange={e => setCertificateName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="e.g. John Doe" />
                        </div>
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Select Duration</label>
                            <select id="duration" name="duration" value={duration} onChange={e => setDuration(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                {[4, 8, 12, 16].map(w => <option key={w} value={w}>{w} Weeks</option>)}</select>
                        </div>
                        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4 rounded-xl text-center border border-indigo-100">
                            <p className="font-semibold text-lg text-indigo-800 mb-2">Application Fee: <span className="font-bold">₹{APPLICATION_FEE}</span></p>
                            <p className="text-sm text-indigo-600 mb-2">(for a {duration}-week internship)</p>
                            {paymentOptions.length > 1 && (
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Payment Option</label>
                                    <select value={selectedOption?._id || ''} onChange={e => setSelectedOption(paymentOptions.find(opt => opt._id === e.target.value))} className="block w-full p-2 border rounded">
                                        {paymentOptions.map(opt => (
                                            <option key={opt._id} value={opt._id}>{opt.displayName} ({opt.upiId})</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {selectedOption && (
                                <div className="flex flex-col items-center gap-2">
                                    {selectedOption.qrCodeUrl ? (
                                        <img src={selectedOption.qrCodeUrl} alt="Scan & Pay QR" className="w-40 h-40 object-contain mx-auto rounded-lg border shadow" />
                                    ) : (
                                        <QRCodeSVG value={`upi://pay?pa=${selectedOption.upiId}&pn=${encodeURIComponent(selectedOption.displayName)}&am=${APPLICATION_FEE}&tn=Internship%20Application%20Fee`} size={160} />
                                    )}
                                    <div className="text-sm text-gray-700">UPI ID: <span className="font-semibold">{selectedOption.upiId}</span></div>
                                    {selectedOption.instructions && <div className="text-xs text-gray-600 mt-1">{selectedOption.instructions}</div>}
                                </div>
                            )}
                            <div className="mt-2">
                                <label className="block text-sm font-medium text-gray-700">Enter UTR/Transaction ID after payment <span className="text-xs text-gray-400">(from your payment app)</span></label>
                                <input type="text" value={utr} onChange={e => setUtr(e.target.value)} required className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="e.g. 1234567890" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Upload Payment Screenshot <span className="text-xs text-gray-400">(jpg, jpeg, png, webp)</span></label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                required
                                onChange={handleScreenshotChange}
                                className="mt-1 block w-full px-3 py-2 border rounded-md bg-white"
                            />
                            {uploading && <div className="text-sm text-indigo-600 mt-1 animate-pulse">Uploading screenshot...</div>}
                            {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
                            {screenshotUrl && <div className="text-green-600 text-xs mt-1 animate-fade-in">Screenshot uploaded!</div>}
                        </div>
                        <div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input id="terms" name="terms" type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="terms" className="font-medium text-gray-700">I agree to the <Link to="/terms" target="_blank" className="text-indigo-600 hover:underline">Terms and Conditions</Link></label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition-all duration-200" disabled={!agreed || loading || isSubmitting || uploading}>
                                {isSubmitting || uploading ? 'Processing...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;