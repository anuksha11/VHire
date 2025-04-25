import React, { useEffect, useState, useCallback } from 'react';
import { useUser } from '../../context/UserContext';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';

// Memoized InputField to prevent unnecessary re-renders
const InputField = React.memo(({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
}) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
        </div>
    );
});

const Display = ({ label, value }: { label: string; value: string }) => (
    <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <p className="mt-1 text-sm text-gray-900">{value || '-'}</p>
    </div>
);

const ProfileCompany: React.FC = () => {
    const { user, login } = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [companyData, setCompanyData] = useState<any>(null);

    const fetchCompanyProfile = async () => {
        try {
            const q = query(collection(db, "company_users"), where("email", "==", user?.email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                setCompanyData(querySnapshot.docs[0].data());
            }
        } catch (err) {
            console.error('Error fetching company data:', err);
        }
    };

    useEffect(() => {
        if (user?.role === 'company') {
            fetchCompanyProfile();
        }
    }, [user]);

    const handleChange = useCallback((field: string, value: string | string[]) => {
        setCompanyData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !companyData) return;

        setLoading(true);
        setError(null);

        try {
            const q = query(collection(db, "company_users"), where("email", "==", user.email));
            const snapshot = await getDocs(q);
            const docRef = snapshot.docs[0].ref;

            await updateDoc(docRef, {
                briefDesc: companyData.briefDesc,
                companyName: companyData.companyName,
                companyType: companyData.companyType,
                contacts: companyData.contacts,
                numEmployees: companyData.numEmployees,
                specialMessage: companyData.specialMessage,
                yearEstablished: companyData.yearEstablished
            });

            login({ ...user, name: companyData.companyName }); // Update name in context
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            {user.role === 'company' && companyData ? (
                                <>
                                    <InputField label="Company Name" value={companyData.companyName || ''} onChange={(val) => handleChange('companyName', val)} />
                                    <InputField label="Brief Description" value={companyData.briefDesc || ''} onChange={(val) => handleChange('briefDesc', val)} />
                                    <InputField label="Company Type" value={companyData.companyType || ''} onChange={(val) => handleChange('companyType', val)} />
                                    <InputField label="Number of Employees" value={companyData.numEmployees || ''} onChange={(val) => handleChange('numEmployees', val)} />
                                    <InputField label="Special Message" value={companyData.specialMessage || ''} onChange={(val) => handleChange('specialMessage', val)} />
                                    <InputField label="Year Established" value={companyData.yearEstablished || ''} onChange={(val) => handleChange('yearEstablished', val)} />
                                    <InputField
                                        label="Contacts"
                                        value={companyData.contacts?.join(', ') || ''}
                                        onChange={(val) => handleChange('contacts', val.split(',').map((v) => v.trim()))}
                                    />
                                </>
                            ) : (
                                <>
                                    <InputField label="Name" value={user.name || ''} onChange={(val) => handleChange('name', val)} />
                                    <InputField label="Email" value={user.email || ''} onChange={(val) => handleChange('email', val)} />
                                </>
                            )}

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 bg-gray-100 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                        </form>
                    ) : (
                        <div className="space-y-4">
                            {user.role === 'company' && companyData ? (
                                <>
                                    <Display label="Company Name" value={companyData.companyName} />
                                    <Display label="Brief Description" value={companyData.briefDesc} />
                                    <Display label="Company Type" value={companyData.companyType} />
                                    <Display label="Number of Employees" value={companyData.numEmployees} />
                                    <Display label="Special Message" value={companyData.specialMessage} />
                                    <Display label="Year Established" value={companyData.yearEstablished} />
                                    <Display label="Contacts" value={companyData.contacts?.join(', ')} />
                                </>
                            ) : (
                                <>
                                    <Display label="Name" value={user?.name} />
                                    <Display label="Email" value={user?.email} />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileCompany;
