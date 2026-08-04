// ===================================================================
// WalletWise - js/navigation.js
// PAGE NAVIGATION
// Every element with a data-page attribute (the sidebar buttons
// and the "View all" link on the dashboard) switches pages the
// same way: hide every .page section, then show the one whose id
// matches the button's data-page value.
// ===================================================================

function showPage(pageId) {
  pageSections.forEach(function (section) {
    section.classList.toggle('active', section.id === pageId);
  });

  // Keep the sidebar's highlighted item in sync with the visible page.
  document.querySelectorAll('.nav-item').forEach(function (navItem) {
    navItem.classList.toggle('active', navItem.dataset.page === pageId);
  });
}

navButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    showPage(button.dataset.page);
  });
});
