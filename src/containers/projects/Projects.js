import React, {useState, useEffect, useContext, Suspense, lazy} from "react";
import "./Project.scss";
import Button from "../../components/button/Button";
import StyleContext from "../../contexts/StyleContext";
import Loading from "../../containers/loading/Loading";
import {getPublicUrl} from "../../utils";
import {usePortfolio} from "../../hooks/usePortfolio";
export default function Projects() {
  const GithubRepoCard = lazy(() =>
    import("../../components/githubRepoCard/GithubRepoCard")
  );
  const FailedLoading = () => null;
  const renderLoader = () => <Loading />;
  const [repo, setrepo] = useState([]);
  const [hasRepoFetchFailed, setHasRepoFetchFailed] = useState(false);
  // todo: remove useContex because is not supported
  const {isDark} = useContext(StyleContext);
  const {
    portfolio: {openSource, socialMediaLinks, ui, githubContent}
  } = usePortfolio();

  useEffect(() => {
    const getRepoData = () => {
      fetch(getPublicUrl("/profile.json"))
        .then(result => {
          if (result.ok) {
            return result.json();
          }
          throw result;
        })
        .then(response => {
          const localizedRepos = response.data.user.pinnedItems.edges.map(
            edge => {
              const repoName = edge && edge.node ? edge.node.name : "";
              const localizedDescription =
                githubContent.repoDescriptions[repoName];

              return {
                ...edge,
                node: {
                  ...edge.node,
                  description: localizedDescription || edge.node.description
                }
              };
            }
          );

          setrepoFunction(localizedRepos);
        })
        .catch(function (error) {
          console.error(
            `${error} (because of this error, nothing is shown in place of Projects section. Also check if Projects section has been configured)`
          );
          setHasRepoFetchFailed(true);
        });
    };
    getRepoData();
  }, [githubContent.repoDescriptions]);

  function setrepoFunction(array) {
    setrepo(array);
  }
  if (Array.isArray(repo) && !hasRepoFetchFailed && openSource.display) {
    return (
      <Suspense fallback={renderLoader()}>
        <div className="main" id="opensource">
          <h1 className="project-title">{ui.sections.openSourceProjects}</h1>
          <div className="repo-cards-div-main">
            {repo.map((v, i) => {
              if (!v) {
                console.error(
                  `Github Object for repository number : ${i} is undefined`
                );
              }
              return (
                <GithubRepoCard repo={v} key={v.node.id} isDark={isDark} />
              );
            })}
          </div>
          <Button
            text={ui.sections.moreProjects}
            className="project-button"
            href={socialMediaLinks.github}
            newTab={true}
          />
        </div>
      </Suspense>
    );
  } else {
    return <FailedLoading />;
  }
}
