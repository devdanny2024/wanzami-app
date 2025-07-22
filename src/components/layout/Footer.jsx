import Link from 'next/link';
import { FaDiscord, FaFacebook, FaTwitter, FaGoogle } from 'react-icons/fa'; // Using react-icons for brand logos

const Footer = () => {
    return (
        <footer className="mt-20 py-12 bg-[#13151a]">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
                 <p className="font-semibold text-lg max-w-2xl mx-auto text-white">Our platform is trusted by millions & features best updated movies all around the world.</p>
                 <div className="flex justify-center space-x-6 my-8">
                     <Link href="#" className="text-gray-400 hover:text-white text-2xl"><FaDiscord /></Link>
                     <Link href="#" className="text-gray-400 hover:text-white text-2xl"><FaFacebook /></Link>
                     <Link href="#" className="text-gray-400 hover:text-white text-2xl"><FaTwitter /></Link>
                     <Link href="#" className="text-gray-400 hover:text-white text-2xl"><FaGoogle /></Link>
                 </div>
                 <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Wanzami. All rights reserved.</p>
                    <div className="flex space-x-4 mt-4 sm:mt-0">
                        <Link href="/privacy" className="hover:text-white">Privacy policy</Link>
                        <Link href="/terms" className="hover:text-white">Term of service</Link>
                        <Link href="/language" className="hover:text-white">Language</Link>
                    </div>
                 </div>
             </div>
        </footer>
    );
};

export default Footer;

