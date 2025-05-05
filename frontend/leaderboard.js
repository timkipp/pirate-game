document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/leaderboard')
      .then(res => {
        if (!res.ok) throw new Error('Network error');
        return res.json();
      })
      .then(data => {
        const ul = document.getElementById('leaderboard-list');
        data.forEach((user, idx) => {
          const li = document.createElement('li');
          li.innerHTML = `<span>${idx + 1}. ${user.userName}</span><span>${user.highScore}</span>`;
          ul.appendChild(li);
        });
      })
      .catch(err => console.error('Leaderboard load failed:', err));
  });
  