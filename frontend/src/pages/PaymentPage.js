import React, { useContext, useState, useEffect, useMemo } from 'react';
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

    // Get application fee from internship, default to 149 if not set
    // Use useMemo to recalculate when internship changes
    const APPLICATION_FEE = useMemo(() => {
        if (internship) {
            // Check if registrationFee exists and is a valid number
            const fee = internship.registrationFee;
            if (typeof fee === 'number' && fee >= 0) {
                return fee;
            }
        }
        return 149; // Default fallback
    }, [internship]);

    useEffect(() => {
        if (!internshipId) {
            setError('No internship selected. Please go back and choose an internship.');
            setLoading(false);
            return;
        }
        const fetchInternship = async () => {
            try {
                const res = await api.get(`/internships/public/${internshipId}`);
                const internshipData = res.data.data;
                setInternship(internshipData);
                // Debug: Log the registration fee to verify it's being received
                console.log('Internship loaded:', { 
                    registrationFee: internshipData.registrationFee, 
                    internshipId: internshipData._id 
                });
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
                paymentOptionId: selectedOption?._id,
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
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center p-6 font-sans">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full border border-gray-200">
                    <BadgeCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
                    <p className="text-gray-600 mb-6">Your application and payment details have been submitted successfully.</p>
                    <Link to="/dashboard/applied-internships" className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition-all">Go to My Applications</Link>
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
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col py-4 sm:py-8 lg:py-12 px-3 sm:px-4 md:px-6 lg:px-8 font-sans">
            <div className="w-full max-w-7xl mx-auto">
                {/* Internship Details Card */}
                <div className="bg-white bg-opacity-95 p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl shadow-xl mb-4 sm:mb-6 md:mb-8">
                    <h2 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 sm:mb-6">
                        Apply for {internship?.title}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-sm sm:text-base md:text-lg">
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <span className="font-bold text-indigo-800 text-sm sm:text-base">Company:</span>
                                <span className="text-gray-700 break-words">{internship?.company}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <span className="font-bold text-indigo-800 text-sm sm:text-base">Location:</span>
                                <span className="text-gray-700 break-words">{internship?.location}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <span className="font-bold text-indigo-800 text-sm sm:text-base">Stipend:</span>
                                <span className="text-gray-700">₹{internship?.stipend || 0}</span>
                            </div>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                                <span className="font-bold text-indigo-800 text-sm sm:text-base">Duration:</span>
                                <span className="text-gray-700 break-words">{internship?.duration}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                                <span className="font-bold text-indigo-800 text-sm sm:text-base">Technologies:</span>
                                <span className="text-gray-700 break-words">{internship?.technologies?.join(', ') || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg sm:rounded-xl border border-indigo-100">
                        <span className="font-bold text-indigo-800 text-base sm:text-lg md:text-xl">Description:</span>
                        <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mt-2">{internship?.description}</p>
                    </div>
                </div>

                {/* Application Form Card */}
                <div className="bg-white/90 sm:bg-white/80 backdrop-blur-md py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-10 shadow-2xl rounded-xl sm:rounded-2xl border border-indigo-100">
                    <form className="space-y-4 sm:space-y-5 md:space-y-6" onSubmit={handleSubmit}>
                        {/* Full Name */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Full Name</label>
                            <input 
                                type="text" 
                                value={user?.name || ''} 
                                readOnly 
                                className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-md bg-gray-100 cursor-not-allowed focus:outline-none" 
                            />
                        </div>

                        {/* Certificate Name */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Certificate Name 
                                <span className="text-xs text-gray-400 ml-1">(as you want it on your certificate)</span>
                            </label>
                            <input 
                                type="text" 
                                value={certificateName} 
                                onChange={e => setCertificateName(e.target.value)} 
                                required 
                                className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                                placeholder="e.g. John Doe" 
                            />
                        </div>

                        {/* Duration Selection */}
                        <div>
                            <label htmlFor="duration" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Select Duration</label>
                            <select 
                                id="duration" 
                                name="duration" 
                                value={duration} 
                                onChange={e => setDuration(e.target.value)} 
                                className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                            >
                                {[4, 8, 12, 16].map(w => <option key={w} value={w}>{w} Weeks</option>)}
                            </select>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-5 md:p-6 rounded-lg sm:rounded-xl text-center border border-indigo-100">
                            <p className="font-semibold text-base sm:text-lg md:text-xl text-indigo-800 mb-1 sm:mb-2">
                                Application Fee: <span className="font-bold">₹{APPLICATION_FEE}</span>
                            </p>
                            <p className="text-xs sm:text-sm text-indigo-600 mb-3 sm:mb-4">(for a {duration}-week internship)</p>
                            
                            {/* Payment Option Selection */}
                            {paymentOptions.length > 1 && (
                                <div className="mb-3 sm:mb-4">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 text-left">Select Payment Option</label>
                                    <select 
                                        value={selectedOption?._id || ''} 
                                        onChange={e => setSelectedOption(paymentOptions.find(opt => opt._id === e.target.value))} 
                                        className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                    >
                                        {paymentOptions.map(opt => (
                                            <option key={opt._id} value={opt._id}>{opt.displayName} ({opt.upiId})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* QR Code */}
                            {selectedOption && (
                                <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-5">
                                    {selectedOption.qrCodeUrl ? (
                                        <img 
                                            src={selectedOption.qrCodeUrl} 
                                            alt="Scan & Pay QR" 
                                            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain mx-auto rounded-lg border-2 border-indigo-200 shadow-md" 
                                        />
                                    ) : (
                                        <div className="p-2 sm:p-3 bg-white rounded-lg border-2 border-indigo-200 shadow-md inline-block">
                                            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48">
                                                <QRCodeSVG 
                                                    value={`upi://pay?pa=${selectedOption.upiId}&pn=${encodeURIComponent(selectedOption.displayName)}&am=${APPLICATION_FEE}&tn=Internship%20Application%20Fee`} 
                                                    size={160}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="text-xs sm:text-sm text-gray-700">
                                        UPI ID: <span className="font-semibold break-all">{selectedOption.upiId}</span>
                                    </div>
                                    {selectedOption.instructions && (
                                        <div className="text-xs sm:text-sm text-gray-600 mt-1 px-2 text-center">{selectedOption.instructions}</div>
                                    )}
                                </div>
                            )}

                            {/* UTR Input */}
                            <div className="mt-3 sm:mt-4">
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 text-left">
                                    Enter UTR/Transaction ID after payment 
                                    <span className="text-xs text-gray-400 ml-1">(from your payment app)</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={utr} 
                                    onChange={e => setUtr(e.target.value)} 
                                    required 
                                    className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
                                    placeholder="e.g. 1234567890" 
                                />
                            </div>
                        </div>

                        {/* Screenshot Upload */}
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                Upload Payment Screenshot 
                                <span className="text-xs text-gray-400 ml-1">(jpg, jpeg, png, webp)</span>
                            </label>
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                required
                                onChange={handleScreenshotChange}
                                className="mt-1 block w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg sm:rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                            {uploading && (
                                <div className="text-xs sm:text-sm text-indigo-600 mt-2 animate-pulse flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Uploading screenshot...
                                </div>
                            )}
                            {error && <div className="text-red-600 text-xs sm:text-sm mt-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                {error}
                            </div>}
                            {screenshotUrl && (
                                <div className="text-green-600 text-xs sm:text-sm mt-2 flex items-center gap-2">
                                    <BadgeCheck className="h-4 w-4" />
                                    Screenshot uploaded successfully!
                                </div>
                            )}
                        </div>

                        {/* Terms Checkbox */}
                        <div>
                            <div className="flex items-start gap-2 sm:gap-3">
                                <div className="flex items-center h-5 pt-0.5">
                                    <input 
                                        id="terms" 
                                        name="terms" 
                                        type="checkbox" 
                                        checked={agreed} 
                                        onChange={e => setAgreed(e.target.checked)} 
                                        className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" 
                                    />
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="terms" className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">
                                        I agree to the{' '}
                                        <Link 
                                            to="/terms" 
                                            target="_blank" 
                                            className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
                                        >
                                            Terms and Conditions
                                        </Link>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2 sm:pt-4">
                            <button 
                                type="submit" 
                                disabled={!agreed || loading || isSubmitting || uploading}
                                className="w-full flex justify-center items-center gap-2 py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 border border-transparent rounded-lg sm:rounded-xl shadow-lg text-sm sm:text-base md:text-lg font-bold text-white bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {isSubmitting || uploading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <span>Submit Application</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;