class UserController {

    constructor(formId, tableId) {

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();


    }

    onSubmit() {

        this.formEl.addEventListener("submit", (event) => {

            event.preventDefault();
            let btn = this.formEl.querySelector("[type=submit]");

            btn.desabled = true;

            let values = this.getValues();

            if (!values) return false;

            this.getPhoto().then((content) => {

                values.photo = content;

                this.addLine(values);

                this.formEl.reset();

                btn.desabled = false;

            }, (e) => {
                console.error(e);


            });

            this.getPhoto((content) => {


            });


        });

    }

    getPhoto() {

        return new Promise((resolve, reject) => {

            let filereader = new FileReader();

            let elements = [...this.formEl.elements].filter(item => {

                if (item.name === 'photo') {

                    return item;

                }
            });

            //console.log(elements);

            let file = elements[0].files[0]

            filereader.onload = () => {

                resolve(filereader.result);

            };

            filereader.onerror = (e) => {
                reject(e);
            }
            if (file) {

                filereader.readAsDataURL(file);

            } else {

                resolve('dist/img/boxed-bg.jpg');
            }


        })

    }

    getValues() {

        let user = {};
        let isValid = true;

        [...this.formEl.elements].forEach(function(field, index) {

            if (['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value) {

                field.parentElement.classList.add('has-error');

                isValid = false;
            }
            if (field.name == "gender") {

                if (field.checked) {

                    user[field.name] = field.value;
                }

            } else if (field.name == "admin") {

                user[field.name] = field.checked;

            } else {

                user[field.name] = field.value;

            }

        });

        if (!isValid) {
            return false;
        }

        return new User(

            user.name,
            user.birth,
            user.gender,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin

        )

    }


    addLine(dataUser) {

        let tr = document.createElement('tr');
        tr.dataset.user = JSON.stringify(dataUser);
        tr.innerHTML = `
        
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim' : 'Não'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        tr.querySelector(".btn-edit").addEventListener("click", e => {

            document.querySelector("#box-user-create").style.display = "none";
            document.querySelector("#box-user-update").style.display = "block";


        })

        this.tableEl.appendChild(tr);

        this.updateCount();
    }


    updateCount() {


        let numberUsers = 0;
        let numberAdmin = 0;

        [...this.tableEl.children].forEach(tr => {

            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin) {

                numberAdmin++;
            }

        });


        document.querySelector("#number-users").innerHTML = numberUsers;

        document.querySelector("#number-user-admin").innerHTML = numberAdmin;


    }


}