function newBook(book) {
    const div = document.createElement('div');
    div.className = 'column is-4';
    div.innerHTML = `
        <div class="card is-shady">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img
                        src="${book.photo}"
                        alt="${book.name}"
                        class="modal-button"
                    />
                </figure>
            </div>
            <div class="card-content">
                <div class="content book" data-id="${book.id}">
                    <div class="book-meta">
                        <p class="is-size-4">R$${book.price.toFixed(2)}</p>
                        <p class="is-size-6">Disponível em estoque: 5</p>
                        <h4 class="is-size-3 title">${book.name}</h4>
                        <p class="subtitle">${book.author}</p>
                    </div>
                    <div class="field has-addons">
                        <div class="control">
                            <input class="input" type="text" placeholder="Digite o CEP" />
                        </div>
                        <div class="control">
                            <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
                        </div>
                    </div>
                    <button class="button button-buy is-success is-fullwidth">Comprar</button>
                </div>
            </div>
        </div>`;
    return div;
}

function calculateShipping(id, cep) {
    fetch('http://localhost:3000/shipping/' + cep)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success');
        })
        .catch((err) => {
            swal('Erro', 'Erro ao consultar frete', 'error');
            console.error(err);
        });
}

function searchBookById(id) {
    if (!id) {
        swal('Atenção', 'Por favor, informe um ID de livro.', 'warning');
        return;
    }

    fetch('http://localhost:3000/product/' + id)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((book) => {
            if (!book || !book.id) {
                swal('Não encontrado', 'Nenhum livro foi encontrado com esse ID.', 'info');
                return;
            }

            swal(
                'Livro encontrado',
                `Título: ${book.name}\nAutor: ${book.author}\nPreço: R$${book.price.toFixed(2)}`,
                'success'
            );
        })
        .catch((err) => {
            swal('Erro', 'Erro ao buscar livro por ID', 'error');
            console.error(err);
        });
}

document.addEventListener('DOMContentLoaded', function () {
    const books = document.querySelector('.books');
    const searchIdButton = document.getElementById('search-id-button');
    const searchIdInput = document.getElementById('search-id-input');

    if (searchIdButton && searchIdInput) {
        searchIdButton.addEventListener('click', () => {
            const id = searchIdInput.value.trim();
            searchBookById(id);
        });
        searchIdInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                const id = searchIdInput.value.trim();
                searchBookById(id);
            }
        });
    }


    fetch('http://localhost:3000/products')
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                data.forEach((book) => {
                    books.appendChild(newBook(book));
                });

                document.querySelectorAll('.button-shipping').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id');
                        const cep = document.querySelector(`.book[data-id="${id}"] input`).value;
                        calculateShipping(id, cep);
                    });
                });

                document.querySelectorAll('.button-buy').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
                    });
                });
            }
        })
        .catch((err) => {
            swal('Erro', 'Erro ao listar os produtos', 'error');
            console.error(err);
        });
});
