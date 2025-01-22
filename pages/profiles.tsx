import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useProfile } from "@/src/context/profileContext";
import useAddProfile from "@/hooks/useAddProfile";
import useProfiles from "@/hooks/useProfiles";
import { iProfile, ProfileContextType } from "@/src/types";
import Loader from "@/src/components/Loader";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Navbar from "@/src/components/Navbar";

import { Plus } from "lucide-react";

const images = [
  "/images/default-blue.png",
  "/images/default-red.png",
  "/images/default-slate.png",
  "/images/default-green.png",
];

export async function getServerSideProps(context: NextPageContext) {
  // this is how you get session on client side
  // getSession: This is a function from next-auth that retrieves the session object.
  const session = await getSession(context);

  if (!session) {
    // if no session redirect to login
    return {
      redirect: {
        destination: "/login",
        // This indicates that the redirection is temporary (HTTP status code 307).
        permanent: false,
      },
    };
  }

  // always suppose to return something from getServerSideProps()
  // This object is passed as props to the page component.
  return {
    props: {},
  };
}

const Profile = ({
  selectedProfile,
  setSelectedProfile,
}: ProfileContextType) => (
  <div
    key={selectedProfile.id}
    onClick={() => setSelectedProfile(selectedProfile)}
    className="flex flex-col text-white items-center cursor-pointer w-[100px] mx-auto"
  >
    <img
      src={selectedProfile.image || images[0]}
      alt={selectedProfile.name}
      className=" object-cover size-[100px] rounded-full overflow-hidden"
    />
    <p className="mt-3 font-semibold">{selectedProfile.name}</p>
  </div>
);

const Profiles = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [duplicateProfile, setDuplicateProfile] = useState(false);

  const { setSelectedProfile } = useProfile();
  const { data: profiles, isLoading: profilesLoading } = useProfiles();

  useEffect(() => {
    if (profiles?.length === 0 && !profilesLoading) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [profiles]);

  const [newProfileName, setNewProfileName] = useState("");
  const {
    addProfile,
    isLoading: addProfileLoading,
    error: addProfileError,
  } = useAddProfile();

  const selectProfile = useCallback(
    (profile: iProfile) => {
      setSelectedProfile(profile);
      localStorage.setItem("profile", JSON.stringify(profile));
      router.push("/");
    },
    [router, setSelectedProfile]
  );

  const handleAddProfile = async () => {
    let isduplicateProfile = false;
    if (profiles?.length) {
      isduplicateProfile = profiles.some((profile) => profile.name === newProfileName);
      if (isduplicateProfile) {
        setDuplicateProfile(true);
        return;
      }
    }
    setDuplicateProfile(false);
    await addProfile(newProfileName, images[0]);
    setNewProfileName("");
  };

  if (profilesLoading || addProfileLoading) {
    return <Loader />;
  }
  if (addProfileError) {
    return (
      <p className="text-xl w-1/3 bg-red-400 text-white font-semibold text-center p-3">
        {" "}
        Something went wrong!
      </p>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen justify-center w-[90%] lg:w-2/5 mx-auto">
        <div className="flex items-center justify-between w-full">
          <h1 className="text-3xl font-semibold text-white mb-3">
            Who&#39;s watching?
          </h1>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-transparent text-white hover:bg-transparent hover:text-blue-500 hover:border-blue-500 text-center"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add profile</DialogTitle>
                <DialogDescription>
                  Create seperate profiles for you and your family members.
                </DialogDescription>
              </DialogHeader>
              <input
                type="text"
                placeholder="New Profile Name"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                className="mb-3 px-3 py-2 rounded w-full border border-gray-300"
              />
              {
                duplicateProfile && (
                  <p className="text-sm  text-red-600 font-semibold text-center ">
                    Profile name already exists!
                  </p>
                )
              }
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleAddProfile}
                  className="w-full md:w-[80%] mx-auto bg-blue-500 hover:bg-blue-600s"
                  disabled={duplicateProfile}
                >
                  Add Profile
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-5 bg-black shadow-sm p-5 rounded-lg w-full flex items-center justify-around flex-wrap gap-4 lg:gap-8">
          {profiles?.length &&
            profiles.map((profile) => (
              <Profile
                key={profile?.id}
                selectedProfile={profile}
                setSelectedProfile={selectProfile}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Profiles;