class UserController {

    constructor(formIdCreate, formIdeUpdate, tableId) {

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdeUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();

    }

    onEdit() {
        document.querySelector('#box-user-update .btn-cancel').addEventListener('click', e => {
            this.showPanelCreate();
        });

        this.formUpdateEl.addEventListener("submit", event => {

            event.preventDefault();

            let btn = this.formUpdateEl.querySelector("[type=submit]");

            btn.desabled = true;

            let values = this.getValues(this.formUpdateEl);

            console.log(values);

        });

    }

    onSubmit() {

        this.formEl.addEventListener("submit", (event) => {

            event.preventDefault();
            let btn = this.formEl.querySelector("[type=submit]");

            btn.desabled = true;

            let values = this.getValues(this.formEl);

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

    getValues(formEl) {

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

            let json = JSON.parse(tr.dataset.user);

            let form = document.querySelector('#form-user-update');


            for (let name in json) {

                let field = form.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {

                    switch (field.type) {
                        case 'file':
                            continue;
                            break;
                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                            break;
                        case 'checkbox':
                            field.checked = json[name];
                            break;
                        default:
                            field.value = json[name];
                    }

                }

            }


            this.showPanelUpdate();
        })

        this.tableEl.appendChild(tr);

        this.updateCount();
    }


    showPanelCreate() {
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";


    }

    showPanelUpdate() {

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

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