import React, {useState, useEffect, lazy, Suspense} from "react";
import Contact from "../contact/Contact";
import Loading from "../loading/Loading";
import {getPublicUrl} from "../../utils";
import {usePortfolio} from "../../hooks/usePortfolio";

const renderLoader = () => <Loading />;
const GithubProfileCard = lazy(() =>
  import("../../components/githubProfileCard/GithubProfileCard")
);
export default function Profile() {
  const [prof, setrepo] = useState(null);
  const [hasProfileFetchFailed, setHasProfileFetchFailed] = useState(false);
  const {
    portfolio: {openSource, githubContent}
  } = usePortfolio();

  function setProfileFunction(array) {
    setrepo(array);
  }

  useEffect(() => {
    if (openSource.showGithubProfile) {
      const getProfileData = () => {
        fetch(getPublicUrl("/profile.json"))
          .then(result => {
            if (result.ok) {
              return result.json();
            }
            throw result;
          })
          .then(response => {
            const githubProfile = response?.data?.user;

            if (!githubProfile) {
              throw new Error("GitHub profile payload is missing user data");
            }

            setProfileFunction({
              ...githubProfile,
              bio: githubContent.bio || githubProfile.bio
            });
          })
          .catch(function (error) {
            console.error(
              `${error} (because of this error GitHub contact section could not be displayed. Contact section has reverted to default)`
            );
            setHasProfileFetchFailed(true);
          });
      };
      getProfileData();
    }
  }, [githubContent.bio, openSource.showGithubProfile]);
  if (
    openSource.display &&
    openSource.showGithubProfile &&
    !hasProfileFetchFailed &&
    prof &&
    prof.avatarUrl
  ) {
    return (
      <Suspense fallback={renderLoader()}>
        <GithubProfileCard
          prof={prof}
          key={prof.avatarUrl || prof.name || "github-profile"}
        />
      </Suspense>
    );
  } else {
    return <Contact />;
  }
}
