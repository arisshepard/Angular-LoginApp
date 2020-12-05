import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { UsuarioModel } from "../../models/usuario.model";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  usuario: UsuarioModel = new UsuarioModel();

  recordar = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem("email")) {
      this.usuario.email = localStorage.getItem("email");
      this.recordar = true;
    }
  }

  login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    Swal.fire({
      text: "Espere por favor...",
      icon: "info",
      allowOutsideClick: false,
    });

    Swal.showLoading();

    // console.log("Login");
    // console.log(form);
    // console.log(this.usuario);

    return this.auth.logIn(this.usuario).subscribe(
      (respuesta) => {
        console.log(respuesta);
        Swal.close();

        if (this.recordar) {
          localStorage.setItem("email", this.usuario.email);
          console.log("estamos recordando");
        } else {
          if (localStorage.getItem("email")) {
            localStorage.removeItem("email");
          }
        }
        this.router.navigateByUrl("/home");
      },
      (error) => {
        console.log(error.error.error.message);
        Swal.fire({
          text: error.error.error.message,
          title: "Error al autenticar",
          icon: "error",
        });
      }
    );
  }
}
