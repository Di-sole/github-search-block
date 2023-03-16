const results = document.querySelector('.results');
const form = document.forms.form;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!isValidForm()) return;

    clearResults();
    submitForm();
});

form.addEventListener('keydown', (e) => {
    if (form.querySelector('.error')) {
        hideError();
    }
});

async function submitForm() {
    const queryString = getQueryString();
    let response = await fetch(`https://api.github.com/search/repositories?${queryString}`);
    let result = await response.json();
    console.log(result)

    if (result.total_count == 0) {
        results.innerHTML = 'Ничего не найдено'
        return;
    }

    addList(result.items, results);
    clearForm();
}

function getQueryString() {
    const str = `${form.search.value} in:name`;
    const queryString = 'q=' + encodeURIComponent(str);

    return queryString;
}

function isValidForm() {
    if (!form.search.value.trim()) {
        showError();
        return false;
    }

    return true;
}

function addList(arr, elem) {
    const resultList = createResultList(arr);
    elem.append(resultList);
}

function createResultList(arr) {
    const resultList = document.createElement('ul');
    resultList.className = 'list';

    let count;
    arr.length < 10 ? count = arr.length : count = 10;

    for (let i = 0; i < count; i++) {
        const listItem = createListItem(arr[i]);
        resultList.append(listItem);
    }

    return resultList;
}

function createListItem(obj) {
    const description = getDescriptionFormated(obj.description);
    const stargazers = getStargazersFormated(obj.stargazers_count);
    const language = getLanguage(obj.language);
    const updated = getDateFormated(obj.updated_at);

    const listItem = document.createElement('li');
    listItem.className = 'list-item';
    listItem.innerHTML = `
        <div class="repo">
            <h3 class="repo__name">
                <a href="${obj.html_url}" class="link" target="_blank">${obj.full_name}</a>
            </h3>
            <p>${description}</p>
            <div class="repo__info">
                <p class="stargazers">${stargazers}</p>
                <p class="language">${language}</p>
                <p class="date">${updated}</p>
            </div>
        </div>
    `;

    return listItem;
}

function getDescriptionFormated(str) {
    if (!str) return '';
    if (str.length < 100) return str;
    return str.slice(0, 100) + '...';
}

function getStargazersFormated(num) {
    if (!num) return '';
    if (num < 1000) return num;
    return (num/1000).toFixed(1) + 'k';
}

function getLanguage(str) {
    if (!str) return '';
    return str;
}

function getDateFormated(str) {
    const date = new Date(str).toLocaleDateString();
    return `Updated: ${date}`;
}

function createErrorEl() {
    const errorEl = document.createElement('div');
    errorEl.className = 'error';
    errorEl.textContent = 'Напишите что-нибудь';

    return errorEl;
}

function showError() {
    const errorEl = createErrorEl();
    errorEl.style.top = '-5px';
    errorEl.style.left = '3px';
            
    form.search.focus();
    form.append(errorEl);
}

function hideError() {
    const errorEl = form.querySelector('.error');
    errorEl.remove();
}

function clearResults() {
    results.innerHTML = '';
}

function clearForm() {
    form.search.value = '';
}