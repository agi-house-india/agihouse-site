"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession, signOut } from "@/lib/auth-client";
import { useState } from "react";
import styles from "../styles";
import { navVariants } from "../utils/motion";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [showMenu, setShowMenu] = useState(false);

  return (
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
            href="/jobs"
            className="hidden lg:block font-semibold text-[15px] text-gray-200 hover:text-white transition-colors duration-200 z-10"
          >
            Jobs
          </Link>

          <Link
            href="/forum"
            className="hidden xl:block font-semibold text-[15px] text-gray-200 hover:text-white transition-colors duration-200 z-10"
          >
            Forum
          </Link>

          <Link
            href="/pricing"
            className="hidden xl:block font-semibold text-[15px] text-purple-400 hover:text-purple-300 transition-colors duration-200 z-10"
          >
            Premium
          </Link>

          <Link
            href="/blog"
            className="hidden xl:block font-semibold text-[15px] text-gray-200 hover:text-white transition-colors duration-200 z-10"
          >
            Blog
          </Link>

          {status === "loading" ? (
            <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse z-10" />
          ) : session ? (
            <div className="relative z-10">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2"
              >
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || ""}
                    width={40}
                    height={40}
                    className="rounded-full border-2 border-purple-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center border-2 border-purple-500">
                    <span className="text-white font-bold">
                      {session.user?.name?.charAt(0) || "?"}
                    </span>
                  </div>
                )}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg py-2">
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-white hover:bg-gray-800"
                    onClick={() => setShowMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-white hover:bg-gray-800"
                    onClick={() => setShowMenu(false)}
                  >
                    My Profile
                  </Link>
                  <hr className="my-2 border-gray-700" />
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors duration-200 rounded-lg font-semibold text-[15px] text-white z-10"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
