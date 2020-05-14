const API_KEY = "2abbf7c3-245b-404f-9473-ade729ed4653";
let results = document.getElementById("results");

// -------------------------- Empieza get bookmarks -----------------------------------
function fetchBookmarks() {
    let url = "/bookmarks"
    let settings = {
        method : "GET",
        headers : {
            Authorization : `Bearer ${API_KEY}`
        }
    }
    results.innerHTML = '';
    fetch(url, settings)
        .then( response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then( responseJSON => {
            responseJSON.forEach(bookmark => {
                results.innerHTML += 
                `
                    <div class="bookmark-box">
                        <p>Nombre: ${bookmark.title}</p>
                        <p>ID: ${bookmark.id}</p>
                        <p>Descripción: ${bookmark.description}</p>
                        <p>Rating: ${bookmark.rating}</p>
                        <p>Link: ${bookmark.url}</p>
                    </div>
                `;
            });
        })
        .catch( err => {
            results.innerHTML = err;
        });
}

function watchGetAllBookmarks() {
    let button = document.getElementById("get-all-bookmarks");
    button.addEventListener("click", (ev) => {
        fetchBookmarks();
    });
}
// -------------------------- Termina get bookmarks -----------------------------------






// -------------------------- Empieza post bookmark -----------------------------------
function postNewBookmark(form) {
    // console.log(form.name.value);
    let url = "/bookmarks";
    let data = {
        title : form.name.value,
        description : form.descripcion.value,
        url :  form.url.value,
        rating : Number(form.rating.value)
    }
    let settings = {
        method : "POST",
        headers : {
            Authorization : `Bearer ${API_KEY}`,
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(data)
    }

    fetch(url, settings)
        .then( response => {
            // console.log(response)
            if(response.ok) {
                form.reset();
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then( responseJSON => {
            // console.log(responseJSON);
            fetchBookmarks();
        })
        .catch( err => {
            // console.log(err);
            alert(err);
        });
}

function watchPostForm() {
    let form = document.getElementById("post-bookmark");
    form.addEventListener("submit", ev => {
        ev.preventDefault();
        postNewBookmark(form);
    });
}
// -------------------------- Termina post bookmark -----------------------------------






// -------------------------- Empieza delete bookmark -----------------------------------
function deleteBookmark(form) {
    let id = form.id.value;
    let url = `/bookmark/${id}`
    let settings = {
        method : "DELETE",
        headers : {
            Authorization : `Bearer ${API_KEY}`
        }
    }
    
    fetch(url, settings)
        .then( response => {
            if(response.ok) {
                fetchBookmarks();
                form.reset();
                return;
            }
            throw new Error(response.statusText);
        })
        .catch( err => {
            alert(err);
        });
}

function watchDeleteForm() {
    let form = document.getElementById("delete-bookmark");
    form.addEventListener("submit", ev => {
        ev.preventDefault();
        deleteBookmark(form);
    });
}
// -------------------------- Termina delete bookmark -----------------------------------







// -------------------------- Empieza update bookmark -----------------------------------
function updateBookmark(form) {
    let id = form.id.value;
    let nombre = form.nombre.value;
    let descripcion = form.descripcion.value;
    let rating = Number(form.rating.value);
    let bookmarkUrl = form.url.value;
    let data = {
        id : id,
        bookmark : {
            ...(nombre ? { title : nombre } : {}),
            ...(descripcion ? { description : descripcion } : {}),
            ...(rating ? { rating } : {}),
            ...(bookmarkUrl ? { url : bookmarkUrl } : {})
        }
    };
    // console.log(data);
    let url = `/bookmark/${id}`;
    let settings = {
        method : "PATCH",
        headers : {
            Authorization : `Bearer ${API_KEY}`,
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(data)
    };

    fetch(url, settings)
        .then( response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then( responseJSON => {
            form.reset();
            fetchBookmarks();
        })
        .catch( err => {
            alert(err);
        });
}

function watchUpdateForm() {
    let form = document.getElementById("update-bookmark");
    form.addEventListener("submit", ev => {
        ev.preventDefault();
        updateBookmark(form);
    });
}
// -------------------------- Termina update bookmark -----------------------------------






// -------------------------- Empieza search bookmark -----------------------------------
function searchBookmark(form) {
    let title = form.nombre.value;
    let url = `/bookmark?title=${title}`;
    let settings = {
        method : "GET",
        headers : {
            Authorization : `Bearer ${API_KEY}`
        }
    };
    
    fetch(url, settings)
        .then( response => {
            if(response.ok) {
                results.innerHTML = "";
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then( responseJSON => {
            responseJSON.forEach(bookmark => {
                results.innerHTML +=
                `
                    <div class="bookmark-box">
                        <p>Nombre: ${bookmark.title}</p>
                        <p>ID: ${bookmark.id}</p>
                        <p>Descripción: ${bookmark.description}</p>
                        <p>Rating: ${bookmark.rating}</p>
                        <p>Link: ${bookmark.url}</p>
                    </div>
                `;
            });
        })
        .catch( err => {
            alert(err);
        })
}

function watchSearchForm() {
    let form = document.getElementById("find-bookmark");
    form.addEventListener("submit", ev => {
        ev.preventDefault();
        searchBookmark(form);
    });
}
// -------------------------- Termina search bookmark -----------------------------------

// function watchWindowResize() {
//     window.addEventListener("resize", ev => {
//         if(ev.target.innerWidth > 990) {
//             console.log(ev.target.innerWidth);

//         }
//     });
// }

function init() {
    onload = fetchBookmarks;
    watchGetAllBookmarks();
    watchPostForm();
    watchDeleteForm();
    watchUpdateForm();
    watchSearchForm();
    // watchWindowResize();
}

init();
