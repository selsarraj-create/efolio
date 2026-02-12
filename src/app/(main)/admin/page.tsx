"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { upload } from '@vercel/blob/client';
import imageCompression from 'browser-image-compression';
import { ModelConfig } from "@/types";

export default function AdminDashboard() {
    const [config, setConfig] = useState<any>(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"info" | "stats" | "images" | "security">("info");
    const [storageMode, setStorageMode] = useState<string>('loading');

    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [newPassword, setNewPassword] = useState("");

    useEffect(() => {
        fetch("/api/config")
            .then((res) => res.json())
            .then((data) => {
                if (data._storage) {
                    setStorageMode(data._storage);
                    delete data._storage;
                }
                setConfig(data);
            });
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Check against the password stored in config, or a default fallback if config is loading/missing pw
        // IMPORTANT: In a real app, don't ship passwords to client. This is a simple protected UI.
        const storedPassword = config?.password || 'change-me-123';

        if (passwordInput === storedPassword) {
            setIsAuthenticated(true);
        } else {
            alert("Incorrect password");
        }
    };

    const handlePasswordChange = async () => {
        if (!newPassword) return;
        try {
            const res = await fetch("/api/admin/update-password", {
                method: "POST",
                body: JSON.stringify({ slug: config?._siteId, newPassword }),
            });
            if (res.ok) {
                alert("Password updated successfully!");
                // Update local state to reflect change
                setConfig({ ...config, password: newPassword });
                setNewPassword("");
            } else {
                alert("Failed to update password.");
            }
        } catch (e) {
            console.error(e);
            alert("Error updating password");
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });
            if (!res.ok) throw new Error('Failed to save');
            alert("Configuration saved!");
        } catch (e) {
            console.error(e);
            alert("Failed to save configuration.");
        } finally {
            setSaving(false);
        }
    };

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setConfig({
            ...config,
            personalInfo: { ...config.personalInfo, [e.target.name]: e.target.value },
        });
    };

    const handleStatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({
            ...config,
            stats: { ...config.stats, [e.target.name]: e.target.value },
        });
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfig({
            ...config,
            socialLinks: { ...(config.socialLinks || {}), [e.target.name]: e.target.value },
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string, index?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        let compressedFile = file;
        try {
            const options = {
                maxSizeMB: 1, // Max 1MB
                maxWidthOrHeight: 1920,
                useWebWorker: true,
            };
            compressedFile = await imageCompression(file, options);
            console.log(`Compressed from ${file.size / 1024 / 1024}MB to ${compressedFile.size / 1024 / 1024}MB`);
        } catch (error) {
            console.error("Compression failed:", error);
        }

        try {
            // _siteId is injected by the backend
            const siteId = config?._siteId || 'site_a';
            const uniqueFilename = `${siteId}/${Date.now()}-${compressedFile.name}`;
            const newBlob = await upload(uniqueFilename, compressedFile, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });

            if (newBlob.url) {
                const newImages = { ...config.images };
                let updatedConfig = { ...config };

                if (type === "portfolio" && typeof index === "number") {
                    newImages.portfolio[index] = newBlob.url;
                } else if (type === "portfolio") {
                    newImages.portfolio.push(newBlob.url);
                } else {
                    // dynamic key access
                    newImages[type] = newBlob.url;
                }

                updatedConfig = { ...updatedConfig, images: newImages };

                // Auto-detect hero orientation
                if (type === "hero") {
                    const img = new window.Image();
                    img.onload = () => {
                        const orientation = img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait';
                        const configWithOrientation = { ...updatedConfig, heroOrientation: orientation };
                        setConfig(configWithOrientation);
                        fetch("/api/config", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(configWithOrientation),
                        }).catch(err => console.error("Auto-save failed:", err));
                    };
                    img.src = newBlob.url;
                } else {
                    setConfig(updatedConfig);
                    try {
                        await fetch("/api/config", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(updatedConfig),
                        });
                    } catch (saveError) {
                        console.error("Auto-save failed:", saveError);
                        alert("Image uploaded, but failed to auto-save config. Please click 'Save Changes'.");
                    }
                }
            }
        } catch (error: any) {
            console.error("Upload Error:", error);
            alert(`Upload failed: ${error.message}`);
        }
    };

    const removePortfolioImage = (index: number) => {
        const newPortfolio = [...config.images.portfolio];
        newPortfolio.splice(index, 1);
        setConfig({
            ...config,
            images: { ...config.images, portfolio: newPortfolio }
        });
    };

    if (!config) return <div className="p-8 text-center text-white">Loading...</div>;

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-900">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-4 uppercase text-black">Client Login</h2>
                    <input
                        type="password"
                        placeholder="Enter Portfolio Password"
                        className="w-full p-2 border mb-4 rounded text-black border-neutral-300"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                    />
                    <button type="submit" className="w-full bg-black text-white p-2 rounded uppercase font-bold hover:bg-neutral-800">Login</button>
                    <p className="mt-4 text-xs text-center text-gray-500">Default: change-me-123</p>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-800 shadow-xl rounded-lg overflow-hidden">
                <div className="bg-neutral-900 text-white p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="font-serif text-2xl tracking-widest uppercase">Admin Dashboard</h1>
                        <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${storageMode.includes('kv') ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                            {storageMode}
                        </span>
                    </div>
                    {/* Only show Save button on content tabs, not Security */}
                    {activeTab !== 'security' && (
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm uppercase tracking-wide font-bold transition-colors disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    )}
                </div>

                <div className="flex border-b border-neutral-200 dark:border-neutral-700">
                    {["info", "stats", "images", "security"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`flex-1 py-4 text-sm uppercase tracking-wider font-bold ${activeTab === tab ? "border-b-2 border-black dark:border-white text-black dark:text-white" : "text-neutral-500"}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-8">
                    {/* Security Tab Content */}
                    {activeTab === "security" && (
                        <div className="max-w-md space-y-4">
                            <h3 className="text-sm font-bold uppercase mb-4 dark:text-white">Change Access Password</h3>
                            <input
                                type="text"
                                placeholder="Enter New Password"
                                className="w-full p-3 border rounded dark:bg-neutral-900 dark:text-white dark:border-neutral-700"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                onClick={handlePasswordChange}
                                className="bg-black text-white px-6 py-2 rounded text-sm uppercase font-bold hover:bg-neutral-800 transition-colors"
                            >
                                Update Password
                            </button>
                        </div>
                    )}

                    {activeTab === "info" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={config.personalInfo.name}
                                        onChange={handleInfoChange}
                                        className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded bg-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={config.personalInfo.email}
                                        onChange={handleInfoChange}
                                        className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded bg-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={config.personalInfo.bio}
                                    onChange={handleInfoChange}
                                    rows={4}
                                    className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded bg-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Copyright Year</label>
                                <input
                                    type="number"
                                    name="copyrightYear"
                                    value={config.personalInfo.copyrightYear}
                                    onChange={handleInfoChange}
                                    className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded bg-transparent"
                                />
                            </div>

                            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                                <h3 className="text-sm font-bold uppercase text-neutral-500 mb-4">Social Media</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Instagram URL</label>
                                        <input
                                            type="url"
                                            name="instagram"
                                            placeholder="https://instagram.com/..."
                                            value={config.socialLinks?.instagram || ''}
                                            onChange={handleSocialChange}
                                            className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded bg-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">TikTok URL</label>
                                        <input
                                            type="url"
                                            name="tiktok"
                                            placeholder="https://tiktok.com/@..."
                                            value={config.socialLinks?.tiktok || ''}
                                            onChange={handleSocialChange}
                                            className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded bg-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Facebook URL</label>
                                        <input
                                            type="url"
                                            name="facebook"
                                            placeholder="https://facebook.com/..."
                                            value={config.socialLinks?.facebook || ''}
                                            onChange={handleSocialChange}
                                            className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "stats" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Object.entries(config.stats).map(([key, value]) => (
                                <div key={key}>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">{key}</label>
                                    <input
                                        type="text"
                                        name={key}
                                        value={value as string}
                                        onChange={handleStatsChange}
                                        className="w-full p-3 border border-neutral-300 dark:border-neutral-600 rounded bg-transparent"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "images" && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-sm font-bold uppercase mb-4">Profile Image</h3>
                                    <div className="relative aspect-square w-48 bg-neutral-100 dark:bg-neutral-900 rounded overflow-hidden mb-4">
                                        <Image src={config.images.profile} alt="Profile" fill className="object-cover" />
                                    </div>
                                    <input type="file" onChange={(e) => handleFileUpload(e, "profile")} className="text-sm" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold uppercase mb-4">Hero Image</h3>
                                    <div className="relative aspect-video w-full bg-neutral-100 dark:bg-neutral-900 rounded overflow-hidden mb-4">
                                        <Image src={config.images.hero} alt="Hero" fill className="object-cover" />
                                    </div>
                                    <input type="file" onChange={(e) => handleFileUpload(e, "hero")} className="text-sm" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold uppercase mb-4">Portfolio Images</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    {config.images.portfolio.map((src: string, i: number) => (
                                        <div key={i} className="relative group">
                                            <div className="relative aspect-[3/4] rounded overflow-hidden">
                                                <Image src={src} alt={`Portfolio ${i}`} fill className="object-cover" />
                                            </div>
                                            <button
                                                onClick={() => removePortfolioImage(i)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded text-center">
                                    <label className="cursor-pointer">
                                        <span className="text-sm font-bold uppercase text-neutral-500">Add Image</span>
                                        <input type="file" onChange={(e) => handleFileUpload(e, "portfolio")} className="hidden" />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
