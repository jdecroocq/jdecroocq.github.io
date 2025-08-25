(function() {
  const base = document.createElement('base');

  const pathParts = window.location.pathname.split('/').filter(Boolean);
  const branches = ["dev", "content"];

  if (pathParts.length > 0 && branches.includes(pathParts[0])) {
    base.href = "/" + pathParts[0] + "/";
  } else {
    base.href = "/";
  }

  document.head.appendChild(base);
})();
