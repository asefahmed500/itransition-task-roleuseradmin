import React from 'react';

const Footer = () => {
    return (
        <div>
            <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content grid-rows-2 p-10">
                <nav>
                    <h6 className="footer-title">User Management</h6>
                    <a className="link link-hover">User Profiles</a>
                    <a className="link link-hover">Roles & Permissions</a>
                    <a className="link link-hover">Activity Logs</a>
                    <a className="link link-hover">Authentication</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Support</h6>
                    <a className="link link-hover">Help Center</a>
                    <a className="link link-hover">Contact Support</a>
                    <a className="link link-hover">FAQs</a>
                    <a className="link link-hover">Documentation</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Legal</h6>
                    <a className="link link-hover">Terms of Service</a>
                    <a className="link link-hover">Privacy Policy</a>
                    <a className="link link-hover">Cookie Policy</a>
                    <a className="link link-hover">GDPR Compliance</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Company</h6>
                    <a className="link link-hover">About Us</a>
                    <a className="link link-hover">Careers</a>
                    <a className="link link-hover">Press</a>
                    <a className="link link-hover">Partners</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Connect</h6>
                    <a className="link link-hover">Twitter</a>
                    <a className="link link-hover">LinkedIn</a>
                    <a className="link link-hover">Facebook</a>
                    <a className="link link-hover">GitHub</a>
                </nav>
                <nav>
                    <h6 className="footer-title">Resources</h6>
                    <a className="link link-hover">Blog</a>
                    <a className="link link-hover">Case Studies</a>
                    <a className="link link-hover">Webinars</a>
                    <a className="link link-hover">API Documentation</a>
                </nav>
            </footer>
        </div>
    );
};

export default Footer;