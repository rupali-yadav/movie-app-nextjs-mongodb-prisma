import Link from "next/link";
import { signOut } from 'next-auth/react';
import { FaCircleUser } from "react-icons/fa6";
import { BiSolidCameraMovie } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { iProfile, iUser } from '@/src/types';
import useProfiles from "@/hooks/useProfiles";
import { useProfile } from "@/src/context/profileContext";
import useCurrentUser from "@/hooks/useCurrentUser";
import { cn } from "@/src/lib/utils";

const Navbar = () => {
   const {
      data: user,
      isLoading: userLoading,
      error: userError,
   } = useCurrentUser();

   const [showSignoutMenu, setShowSignoutMenu] = useState(false);
   const { data: profiles, isLoading: profilesLoading } = useProfiles();
   const { setSelectedProfile, selectedProfile } = useProfile();

   const handleProfileChange = (profile: iProfile) => {
      localStorage.setItem("profile", JSON.stringify(profile));
      setSelectedProfile(profile);
   }

   return (
      <header className="flex items-center justify-between gap-2 py-4 bg-black text-white px-4 w-full sticky top-0 left-0 z-40">
         <nav className="flex items-center gap-5 text-sm md:text-lg font-medium w-full cursor-pointer">
            <Link
               href="#"
               className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
               <BiSolidCameraMovie className="h-6 w-6" />
               <span className="sr-only">Acme Inc</span>
            </Link>
            <Link
               href="/"
               className=" transition-colors hover:text-blue-500"
            >
               Home
            </Link>
            <Link
               href="/myList"
               className=" transition-colors hover:text-blue-500 whitespace-nowrap"
            >
               My list
            </Link>
            <Link
               href="/profiles"
               className=" transition-colors hover:text-blue-500 whitespace-nowrap"
            >
               My profiles
            </Link>
         </nav>

         {
            selectedProfile?.name && (
               <p className="text-md font-semibold">{selectedProfile?.name}</p>
            )
         }
         <DropdownMenu>
            <DropdownMenuTrigger asChild className="bg-black text-white cursor-pointer">
               <Button
                  onClick={() => { setShowSignoutMenu(!showSignoutMenu) }}
                  variant="secondary"
                  size="icon"
                  className="rounded-full cursor-pointer"
               >

                  <FaCircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
               </Button>
            </DropdownMenuTrigger>


            <DropdownMenuContent align="end" className="cursor-pointer" >
               {
                  profiles?.length && profiles?.map((profile) => (
                     <div key={profile?.id}>
                        {/* profile?.id=== selectedProfile?.id highlight that user*/}
                        <DropdownMenuLabel
                           className={cn(profile?.id === selectedProfile?.id ? "border-2 border-blue-500 rounded" : "")}
                           onClick={() => handleProfileChange(profile)}
                        >
                           {profile?.name}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                     </div>
                  ))
               }
               <DropdownMenuLabel onClick={() => signOut()}>Sign out</DropdownMenuLabel>
            </DropdownMenuContent>
         </DropdownMenu>
      </header>
   )
}

export default Navbar;