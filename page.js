const {shell, ipcRenderer} = require('electron');

function onClick (e) {
	let lnk = e.target.closest('.js-navigation-open') || e.target.closest('.notifications-repo-link');
	if (!lnk) return;
	e.preventDefault();
	e.stopPropagation();
	shell.openExternal(lnk.href);
}


function reload () {
	document.querySelector('.filter-item.selected').click();
	setTimeout(sendCount, 1000);
	setTimeout(reload, 10000);
}

function sendCount() {
	const countEl = document.querySelector('.filter-list .filter-item.selected .count');
	const count = countEl ? countEl.innerText : '0';
	ipcRenderer.send('unread-count', count);
}

document.addEventListener('click', onClick);
reload();
