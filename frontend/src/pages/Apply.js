import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../config/api';
import AuthContext from '../context/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const Apply = () => {
    const { internshipId } = useParams();
    const { user, isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [duration, setDuration] = useState('4'); // Default to 4 weeks
    const [agreed, setAgreed] = useState(false);
    const [internship, setInternship] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isApplying, setIsApplying] = useState(false);
    const [certificateName, setCertificateName] = useState('');
    const [utr, setUtr] = useState('');
    const [paymentOptions, setPaymentOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);

    const APPLICATION_FEE = 129;
    const upiId = 'studentera@pnb';
    const upiPayUrl = `upi://pay?pa=${upiId}&pn=Internship%20Payment&am=${APPLICATION_FEE}&tn=Internship%20Application%20Fee`;

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/apply/${internshipId}` } });
        }
        
        const fetchInternship = async () => {
            try {
                const res = await api.get(`/internships/public/${internshipId}`);
                setInternship(res.data.data);
            } catch (err) {
                console.error(err);
                setError('Could not load internship details. It might be closed or invalid.');
            } finally {
                setLoading(false);
            }
        };
        fetchInternship();

        // Fetch payment options
        api.get('/payment-options').then(res => {
            setPaymentOptions(res.data.data);
            setSelectedOption(res.data.data[0] || null);
        });
    }, [internshipId, isAuthenticated]);

    const calculateAmount = () => APPLICATION_FEE;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreed) {
            alert('You must agree to the terms and conditions.');
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
        setIsApplying(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const applicationData = {
                internshipId: internship._id,
                duration,
                certificateName,
                utr
            };
            const { data } = await api.post('/applications', applicationData, config);
            navigate(`/payment/${data.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not start application process.');
            setIsApplying(false);
        }
    };

    if (loading || !user) return (
        <div className="flex flex-col justify-center items-center h-screen">
            <Loader2 className="animate-spin h-12 w-12 text-indigo-600 mb-4" />
            <p className="text-lg text-gray-700">Loading Internship Details...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col justify-center items-center h-screen text-center p-4">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-red-600">Application Error</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <Link to="/internships" className="text-indigo-600 hover:underline">Browse Internships</Link>
        </div>
    );
    
    if (!internship) {
        return <div className="flex flex-col justify-center items-center h-screen text-center p-4">
            <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-yellow-600">No Internship Data</h2>
            <p className="text-gray-700 mb-4">Could not load internship details. Please try again.</p>
            <Link to="/internships" className="text-indigo-600 hover:underline">Browse Internships</Link>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 px-2">
            <div className="sm:mx-auto sm:w-full sm:max-w-lg">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-indigo-700">
                    Apply for {internship.title}
                </h2>
                <div className="mt-2 text-center text-base text-gray-700">
                    <span className="font-semibold">Company:</span> {internship.company}<br/>
                    <span className="font-semibold">Location:</span> {internship.location}<br/>
                    <span className="font-semibold">Stipend:</span> ₹{internship.stipend} <br/>
                    <span className="font-semibold">Duration:</span> {internship.duration}<br/>
                    <span className="font-semibold">Technologies:</span> {internship.technologies?.join(', ')}
                </div>
                <div className="mt-4 text-gray-700 text-justify bg-white rounded-lg p-4 shadow">
                    <span className="font-semibold">Description:</span> <br/>
                    {internship.description}
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
                            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400" disabled={!agreed || loading || isApplying}>
                                {isApplying ? 'Processing...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Apply;
