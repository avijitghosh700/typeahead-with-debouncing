// user API --> https://jsonplaceholder.typicode.com/users

let searchForm = document.querySelector('.search');
let searchInput = document.querySelector('[name="search"]');
let searchResult = document.querySelector('#results');
let formData = null;

let resultList = document.createElement('ul');
resultList.setAttribute('class', 'typeahead__resultsList list-unstyled m-0');
searchResult.appendChild(resultList);

const search = async (query) => {
  // A little verbose way
  // const request = await fetch('https://jsonplaceholder.typicode.com/users')
  //   .then((res) => res.json())
  //   .then((data) => console.log(data))

  let matches = [];
  const regexBlankSpace = new RegExp('^ ');
  
  if (!regexBlankSpace.test(query)) {
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

searchInput.addEventListener('input', () => {
  formData = new FormData(searchForm);
  search(formData.get('search'))
})

// searchForm.addEventListener('submit', (evt) => {
//   formData = new FormData(searchForm);

//   evt.preventDefault();
// })