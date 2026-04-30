function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function convertUrlsToLinks(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

async function loadProjectContent() {
  const projectId = getQueryParam('id');

  const mainContent = document.getElementById('mainContent');
  const projectContentContainer = document.getElementById('projectContent');
  const videoContainer = document.getElementById('videoSection');
  const imagesContainer = document.getElementById('imagesSection');

  mainContent.style.display = 'block';

  if (!projectId) {
    mainContent.innerHTML = '<h1>Error: Project ID is missing from the URL.</h1>';
    return;
  }

  try {
    const response = await fetch(`/projects/${projectId}/project.json`);
    if (!response.ok) throw new Error(`Project not found (HTTP ${response.status})`);
    const projectData = await response.json();

    const listResponse = await fetch('/projects/projects-list.json');
    const projectList = await listResponse.json();
    const projectInfo = projectList.find(p => p.id === projectId);
    const projectTitle = projectInfo ? projectInfo.title : projectId;
    document.title = projectTitle;

    let contentHTML = `<h2>${projectTitle}</h2><h5>Published on ${projectData.date}</h5>`;
    const formattedDescription = convertUrlsToLinks(projectData.description);

    projectContentContainer.style.whiteSpace = 'pre-wrap';
    projectContentContainer.innerHTML = contentHTML + formattedDescription;

    videoContainer.innerHTML = '';
    if (projectData.youtubeId) {
      videoContainer.innerHTML = `
        <div class="project-video-container">
          <iframe
            src="https://www.youtube.com/embed/${projectData.youtubeId}"
            frameborder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
      `;
    }

    imagesContainer.innerHTML = '';
    if (projectData.imageCount && projectData.imageCount > 0) {
      let imagesHTML = '';
      for (let i = 1; i <= projectData.imageCount; i++) {
        const imageNumber = String(i).padStart(2, '0');
        const webPath = `/projects/${projectId}/web/${imageNumber}.jpg`;
        const fullPath = `/projects/${projectId}/full/${imageNumber}.jpg`;

        imagesHTML += `
          <div class="project-image">
            <div class="img-hq-wrapper">
              <img src="${webPath}" alt="${projectTitle} - Image ${i}" class="project-img"/>
              <a href="${fullPath}" target="_blank" rel="noopener noreferrer"
                 class="btn btn-icon hq-button" title="View in high quality">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2"
                     stroke-linejoin="miter" stroke-linecap="square">
                  <path d="M3 8 V3 H8 M16 3 H21 V8 M21 16 V21 H16 M8 21 H3 V16"/>
                </svg>
              </a>
            </div>
          </div>
        `;
      }
      imagesContainer.innerHTML = imagesHTML;
    }

    updateProjectNavigation(projectId, projectList);

  } catch (error) {
    console.error('Failed to load project content:', error);
    mainContent.innerHTML = `<h1>Error loading project.</h1><p>${error.message}</p>`;
  }
}

function updateProjectNavigation(currentProjectId, projectList) {
  const nav = document.getElementById('projectNav');
  const prevLink = document.getElementById('navPrevProject');
  const nextLink = document.getElementById('navNextProject');

  if (!nav || !prevLink || !nextLink) return;

  const currentIndex = projectList.findIndex(p => p.id === currentProjectId);
  if (currentIndex === -1) return;

  const prevIndex = (currentIndex - 1 + projectList.length) % projectList.length;
  const nextIndex = (currentIndex + 1) % projectList.length;

  prevLink.href = `/project_details.html?id=${projectList[prevIndex].id}`;
  nextLink.href = `/project_details.html?id=${projectList[nextIndex].id}`;

  nav.style.display = 'flex';
}

window.addEventListener('DOMContentLoaded', () => {
  loadProjectContent();
});
