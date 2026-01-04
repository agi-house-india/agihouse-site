"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "../styles";
import { navVariants } from "../utils/motion";

const Navbar = () => (
  <motion.nav
    variants={navVariants}
    initial="hidden"
    whileInView="show"
    className={`${styles.xPaddings} py-8 relative`}
  >
    <div className="absolute w-[50%] inset-0 gradient-01" />
    <div className={`${styles.innerWidth} mx-auto flex justify-between gap-8`}>
      <Link
        href="/"
        className="font-extrabold text-[24px] text-white leading-[30px] z-10"
      >
        AGIHOUSE
      </Link>

      <div className="flex items-center gap-3 sm:gap-5">
        <Link
          href="/startups"
          className="hidden md:block font-semibold text-[15px] text-gray-200 hover:text-white transition-colors duration-200 z-10"
        >
          Startups
        </Link>

        <Link
          href="/members"
          className="hidden md:block font-semibold text-[15px] text-gray-200 hover:text-white transition-colors duration-200 z-10"
        >
          Members
        </Link>

        <Link
          href="/events"
          className="hidden sm:block font-semibold text-[15px] text-gray-200 hover:text-white transition-colors duration-200 z-10"
        >
          Events
        </Link>

        <Link
          href="/blog"
          className="hidden lg:block font-semibold text-[15px] text-gray-200 hover:text-white transition-colors duration-200 z-10"
        >
          Blog
        </Link>

        <Link
          href="/auth/signin"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors duration-200 rounded-lg font-semibold text-[15px] text-white z-10"
        >
          Sign In
        </Link>
      </div>
    </div>
  </motion.nav>
);

export default Navbar;
