// user API --> https://jsonplaceholder.typicode.com/users

let searchForm = document.querySelector('.search');
let searchInput = document.querySelector('[name="search"]');
let searchResult = document.querySelector('#results');
let formData = null;

let resultList = document.createElement('ul');
resultList.setAttribute('class', 'typeahead__resultsList list-unstyled m-0');
searchResult.appendChild(resultList);

const search = async (query) => {
  let matches = [];
  const regexBlankSpace = new RegExp('^ ');
  
  if (!regexBlankSpace.test(query)) {
    // A little verbose way
    // const request = await fetch('https://jsonplaceholder.typicode.com/users')
    //   .then((res) => res.json())
    //   .then((data) => console.log(data))

    const request = await fetch('https://jsonplaceholder.typicode.com/users');
    const response = await request.json();
    
    matches = response.filter(
      (users) => {
        const regexQuery = new RegExp(`${query}`, 'gi'); //'gi' => global and case-insensitive
        return users.name.match(regexQuery) || users.username.match(regexQuery);
      }
    );
    
    if (matches.length > 0 && query.length > 0) {
      searchResult.classList.add('show');
      
      // Making an array of HTMLListElements for each match found.
      let userItem = matches.map(
        (user) => 
        `<li class="typeahead__resultItem">
          <a href="javascript:void(0)" class="typeahead__resultLink">
            <span class="fs fs__md 
              color-green 
              fw-bold">
              ${user.name}
            </span>
            ${user.username}
          </a>
        </li>`
      );

      resultList.innerHTML = userItem.join(''); //Converting the array to string.
    }
    else {
      matches = [];
      resultList.innerHTML = '';
      searchResult.classList.remove('show');
    }
  }
}

let delayedSearch = (fn, delay) => {
  let timer;
  return function() {
    let context = this,
      args = arguments;
      
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      console.log(args);
      fn.apply(context, args);
    }, delay);
  }
}

searchInput.addEventListener('input', () => {
  formData = new FormData(searchForm);
  delayedSearch(search, 300)(formData.get('search'));
})

// searchForm.addEventListener('submit', (evt) => {
//   formData = new FormData(searchForm);

//   evt.preventDefault();
// })