import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import AuthContext from '../context/AuthContext';
import { AlertTriangle, BadgeCheck, CreditCard, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const PaymentPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
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

    const APPLICATION_FEE = 129;

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
            setPaymentOptions(res.data.data);
            setSelectedOption(res.data.data[0] || null);
        });
    }, [internshipId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreed) {
            setError('You must agree to the terms and conditions.');
            return;
        }
        if (!certificateName.trim()) {
            setError('Please enter the certificate name.');
            return;
        }
        if (!utr.trim()) {
            setError('Please enter the UTR/Transaction ID after payment.');
            return;
        }
        if (!screenshotUrl) {
            setError('Please upload a payment screenshot.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const formData = new FormData();
            formData.append('internshipId', internshipId);
            formData.append('duration', duration);
            formData.append('certificateName', certificateName);
            formData.append('utr', utr);
            formData.append('paymentScreenshot', screenshotUrl); // Send Cloudinary URL
            await api.post('/applications', formData, config);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not submit application.');
        }
        setIsSubmitting(false);
    };

    const handleScreenshotChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        const formData = new FormData();
        formData.append('paymentScreenshot', file);
        try {
            const token = localStorage.getItem('token');
            const res = await api.post(
                '/applications/upload-payment-screenshot',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setScreenshotUrl(res.data.screenshot); // Save backend path
        } catch (err) {
            setScreenshotUrl('');
            alert('Failed to upload screenshot. Please try again.');
        }
        setUploading(false);
    };

    console.log("PaymentPage rendered", { internshipId, loading, error, internship });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center p-6">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link to="/internships" className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold">
                        Browse Internships
                    </Link>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center p-6">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
                    <BadgeCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
                    <p className="text-gray-600 mb-6">Your application and payment details have been submitted successfully.</p>
                    <Link to="/dashboard/applied-internships" className="w-full inline-flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold">
                        Go to My Applications
                    </Link>
                </div>
            </div>
        );
    }

    if (!loading && !error && !internship) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded shadow text-center">
                    <p className="text-lg text-gray-700">No internship data found. Please try again later.</p>
                    <Link to="/internships" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Browse Internships</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-2">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-indigo-700">
                    Apply for {internship?.title}
                </h2>
                <div className="mt-2 text-center text-base text-gray-700">
                    <span className="font-semibold">Company:</span> {internship?.company}<br/>
                    <span className="font-semibold">Location:</span> {internship?.location}<br/>
                    <span className="font-semibold">Stipend:</span> ₹{internship?.stipend} <br/>
                    <span className="font-semibold">Duration:</span> {internship?.duration}<br/>
                    <span className="font-semibold">Technologies:</span> {internship?.technologies?.join(', ')}
                </div>
                <div className="mt-4 text-gray-700 text-justify bg-white rounded-lg p-4 shadow">
                    <span className="font-semibold">Description:</span> <br/>
                    {internship?.description}
                </div>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
                                {[4, 8, 12, 16].map(w => <option key={w} value={w}>{w} Weeks</option>)}
                            </select>
                        </div>
                        <div className="bg-indigo-50 p-4 rounded-md text-center">
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
                                        <img src={selectedOption.qrCodeUrl} alt="Scan & Pay QR" className="w-40 h-40 object-contain mx-auto rounded-lg border" />
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
                            {uploading && <div className="text-sm text-indigo-600 mt-1">Uploading screenshot...</div>}
                            {screenshotUrl && <div className="text-green-600 text-xs mt-1">Screenshot uploaded!</div>}
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
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400" disabled={!agreed || loading || isSubmitting}>
                                {isSubmitting ? 'Processing...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;