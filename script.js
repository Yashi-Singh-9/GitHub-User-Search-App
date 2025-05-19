const searchInput = document.getElementById('search');
const searchButton = document.querySelector('.search-info button');
const themeSwitcher = document.getElementById('theme-switcher');

const userImage = document.querySelector('.user-image');
const userName = document.querySelector('.name');
const userJoined = document.querySelector('.joined');
const userUsername = document.querySelector('.username');
const userBio = document.getElementById('user-bio');
const userRepos = document.getElementById('user-repos');
const userFollowers = document.getElementById('user-followers');
const userFollowing = document.getElementById('user-following');

const userLocation = document.querySelector('#user-location .user-link');
const userTwitter = document.querySelector('#user-twitter .user-link');
const userWebsite = document.querySelector('#user-website .user-link');
const userOrganization = document.querySelector('#user-organization .user-link');

// Fetch GitHub user data
function fetchUser(username) {
  fetch(`https://api.github.com/users/${username}`)
    .then(res => {
      if (!res.ok) throw new Error('User not found');
      return res.json();
    })
    .then(data => renderUser(data))
    .catch(err => {
      alert('GitHub user not found');
    });
}

// Render user data into DOM
function renderUser(data) {
  userImage.src = data.avatar_url;
  userName.textContent = data.name || data.login;
  userUsername.textContent = `@${data.login}`;
  userJoined.textContent = `Joined ${new Date(data.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })}`;
  userBio.textContent = data.bio || 'This profile has no bio';

  userRepos.textContent = data.public_repos;
  userFollowers.textContent = data.followers;
  userFollowing.textContent = data.following;

  // Location
  updateLink(userLocation, data.location);

  // Twitter
  updateLink(userTwitter, data.twitter_username ? `https://twitter.com/${data.twitter_username}` : null, data.twitter_username);

  // Website
  updateLink(userWebsite, data.blog);

  // Company
  updateLink(userOrganization, data.company);
}

// Helper function to update link or disable it
function updateLink(element, href, text) {
  if (!href) {
    element.parentElement.classList.add('opacity-50');
    element.textContent = 'Not Available';
    element.removeAttribute('href');
  } else {
    element.parentElement.classList.remove('opacity-50');
    element.href = href;
    element.textContent = text || href;
  }
}

// Search button event
searchButton.addEventListener('click', () => {
  const username = searchInput.value.trim();
  if (username) {
    fetchUser(username);
  }
});

// Enter key also triggers search
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    searchButton.click();
  }
});

// Theme switcher
themeSwitcher.addEventListener('click', () => {
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme') === 'light';

  if (isLight) {
    html.setAttribute('data-theme', 'dark');
    themeSwitcher.innerHTML = `Dark <img src="images/icon-moon.svg" alt="">`;
    localStorage.setItem('theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
    themeSwitcher.innerHTML = `Light <img src="images/icon-sun.svg" alt="">`;
    localStorage.setItem('theme', 'light');
  }
});

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeSwitcher.innerHTML = savedTheme === 'light'
    ? `Light <img src="images/icon-sun.svg" alt="">`
    : `Dark <img src="images/icon-moon.svg" alt="">`;

  // Load default profile
  fetchUser('Yashi-Singh-9');
});
