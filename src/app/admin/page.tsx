"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ModelConfig } from "@/types";

export default function AdminDashboard() {
    const [config, setConfig] = useState<ModelConfig | null>(null);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<"info" | "stats" | "images">("info");
    const [storageMode, setStorageMode] = useState<string>('loading');

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

    if (!config) return <div className="p-8 text-center">Loading...</div>;

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch("/api/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(config),
            });
            alert("Configuration saved!");
        } catch {
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string, index?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();

            if (data.url) {
                const newImages = { ...config.images };

                if (type === "portfolio" && typeof index === "number") {
                    newImages.portfolio[index] = data.url;
                } else if (type === "portfolio") {
                    newImages.portfolio.push(data.url);
                } else {
                    // @ts-expect-error - dynamic key access
                    newImages[type] = data.url;
                }

                setConfig({ ...config, images: newImages });
            }
        } catch (error) {
            console.error(error);
            alert("Upload failed");
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

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-800 shadow-xl rounded-lg overflow-hidden">
                <div className="bg-neutral-900 dark:bg-black text-white p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="font-serif text-2xl tracking-widest uppercase">Admin Dashboard</h1>
                        <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase tracking-wider ${storageMode.includes('kv') ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'}`}>
                            Storage: {storageMode}
                        </span>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-sm uppercase tracking-wide font-bold transition-colors disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                <div className="flex border-b border-neutral-200 dark:border-neutral-700">
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`flex-1 py-4 text-sm uppercase tracking-wider font-bold ${activeTab === "info" ? "border-b-2 border-gold-500 text-gold-500" : "text-neutral-500"}`}
                    >
                        Info
                    </button>
                    <button
                        onClick={() => setActiveTab("stats")}
                        className={`flex-1 py-4 text-sm uppercase tracking-wider font-bold ${activeTab === "stats" ? "border-b-2 border-gold-500 text-gold-500" : "text-neutral-500"}`}
                    >
                        Stats
                    </button>
                    <button
                        onClick={() => setActiveTab("images")}
                        className={`flex-1 py-4 text-sm uppercase tracking-wider font-bold ${activeTab === "images" ? "border-b-2 border-gold-500 text-gold-500" : "text-neutral-500"}`}
                    >
                        Images
                    </button>
                </div>

                <div className="p-8">
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
                                        value={value}
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
                                    {config.images.portfolio.map((src, i) => (
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
