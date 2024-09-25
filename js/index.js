const inputElement = document.querySelector("#user_input");
const dropdownMenu = document.querySelector(".dropdown-menu");
const resultsList = document.querySelector(".results");
const TOKEN = `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`;

inputElement.addEventListener("input", async function () {
    try {
        const query = inputElement.value.trim();
        const results = await debounce(1000, searchProjects(query));
    } catch (err) {
        console.log(`Ошибка обработки колбэка инпута: ${err}`);
    }
});

const searchProjects = async function (query) {
    try {
        const response = await fetch(
            `https://api.github.com/search/repositories?q=topic:${query}&per_page=5`,
            {
                method: "GET",
                headers: {
                    Authorization: `token ${TOKEN}`,
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Ошибка запроса к API: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        // console.log(data.items.name)
        // console.log(data.items.owner.login)
        // console.log(data.items.stargazers_count)
        renderProjects(data);
    } catch (err) {
        console.log(`Ошибка поиска репозиториев: ${err}`);
    }
};

const renderProjects = function (data) {
    dropdownMenu.innerHTML = ""; //Очищаем предыдущие значения
    for (let i = 0; i < 5; i++) {
        try {
            const projectBox = document.createElement("li");

            const projectName = document.createElement("p");
            projectName.textContent = `Name: ${data.items[i].name}`;

            const projectOwner = document.createElement("p");
            projectOwner.textContent = `Owner: ${data.items[i].owner.login}`;

            const projectStars = document.createElement("p");
            projectStars.textContent = `Stars: ${data.items[i].stargazers_count}`;

            dropdownMenu.append(projectBox);
            projectBox.append(projectName);
            projectBox.append(projectOwner);
            projectBox.append(projectStars);

            console.log(
                `Отрендерил элемент ${data.items[i].name} ${data.items[i].owner.login} ${data.items[i].stargazers_count}`
            );
            projectBox.addEventListener("click", function () {
                addProject(
                    data.items[i].name,
                    data.items[i].owner.login,
                    data.items[i].stargazers_count
                );
            });
        } catch (err) {
            console.log(`Ошибка рендеринга подсказок: ${err}`);
        }
    }
};

const addProject = function (name, owner, stars) {
    try {
        dropdownMenu.innerHTML = "";
        inputElement.value = "";
        const projectBox = document.createElement("li");

        const projectName = document.createElement("p");
        projectName.textContent = `Name: ${name}`;

        const projectOwner = document.createElement("p");
        projectOwner.textContent = `Owner: ${owner}`;

        const projectStars = document.createElement("p");
        projectStars.textContent = `Stars: ${stars}`;

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");

        deleteButton.addEventListener("click", function () {
            resultsList.removeChild(projectBox);
        });

        resultsList.append(projectBox);
        projectBox.append(projectName);
        projectBox.append(projectOwner);
        projectBox.append(projectStars);
        projectBox.append(deleteButton);
    } catch (err) {
        console.log(`Ошибка в отрисовке списка репозиториев: ${err}`);
    }
};

const debounce = function (callback, delay) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback.apply(this, args), delay);
    };
};
