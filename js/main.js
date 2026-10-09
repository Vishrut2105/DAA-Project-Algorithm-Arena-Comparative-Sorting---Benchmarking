// Simple Tab Navigation Controller

function showTab(tabId) {
  // Hide all tab contents
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => {
    content.classList.remove('active');
  });

  // Remove active state from all buttons
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
  });

  // Activate selected tab content
  const targetContent = document.getElementById(tabId);
  if (targetContent) {
    targetContent.classList.add('active');
  }

  // Activate matching button
  const activeButton = Array.from(buttons).find(btn => btn.getAttribute('onclick').includes(tabId));
  if (activeButton) {
    activeButton.classList.add('active');
  }
}
