import { useState } from "react";

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Contact form submitted:', formData);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Contact Us
                    </h1>
                    <p className="text-xl text-gray-600">
                        Questions about C-ya? We'd love to hear from you!
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">GitHub</h3>
                                    <a
                                      href="https://github.com/Dr1ftKing/C-YA" 
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-500"
                                    >
                                      github.com/Dr1ftKing/C-YA
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <svg className="w-6 h-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">LinkedIn</h3>
                                    <a 
                                      href="https://www.linkedin.com/in/juan-lopz/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-500"
                                    >
                                      Connect with me
                                    </a> 
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            {submitted ? (
                              <div className="text-center">
                                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                  Thank you for your message!
                                </h3>
                                <p className="text-gray-600">
                                    We'll get back to you as soon as possible.
                                </p>
                                <button
                                  onClick={() => setSubmitted(false)}
                                  className="mt-4 text-blue-600 hover:text-blue-500"
                                >
                                    Send another message
                                </button>
                              </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                            Your Name
                                        </label>
                                        <input
                                           type="text"
                                           id="name"
                                           name="name"
                                           required
                                           value={formData.name}
                                           onChange={handleChange}
                                           className="w-full px-3 py-2 border border-soft-periwinkle rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address
                                        </label>
                                        <input
                                           type="email"
                                           id="email"
                                           name="email"
                                           required
                                           value={formData.email}
                                           onChange={handleChange}
                                           className="w-full px-3 py-2 border border-soft-periwinkle rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />   
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject
                                        </label>
                                        <select
                                           id="subject"
                                           name="subject"
                                           required
                                           value={formData.subject}
                                           onChange={handleChange}
                                           className="w-full px-3 py-2 border border-soft-periwinkle rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="general">General Question</option>
                                            <option value="bug">Bug Report</option>
                                            <option value="feature">Feature Request</option>
                                            <option value="feedback">Feedback</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                           id="message"
                                           name="message"
                                           required
                                           rows={5}
                                           value={formData.message}
                                           onChange={handleChange}
                                           className="w-full px-3 py-2 border border-soft-periwinkle rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                           placeholder="Tell us how we can help..."
                                        />
                                    </div>
                                    <button
                                      type="submit"
                                      className="w-full px-6 py-3 bg-soft-periwinkle text-white font-medium rounded-md hover:bg-slate-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                                    >
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;