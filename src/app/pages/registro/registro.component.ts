import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { UsuarioModel } from "../../models/usuario.model";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-registro",
  templateUrl: "./registro.component.html",
  styleUrls: ["./registro.component.css"],
})
export class RegistroComponent implements OnInit {
  usuario: UsuarioModel;
  recordar = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.usuario = new UsuarioModel();

    // this.usuario.email = "mlopez@extrasoft.es";
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    // console.log("Formulario enviado");
    // console.log(this.usuario);
    // console.log(form);

    Swal.fire({
      text: "Espere por favor...",
      icon: "info",
      allowOutsideClick: false,
    });

    Swal.showLoading();

    this.auth.nuevoUsuario(this.usuario).subscribe(
      (respuesta) => {
        console.log(respuesta);
        Swal.close();

        if (this.recordar) {
          localStorage.setItem("email", this.usuario.email);
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
          title: "Error al registrarse",
          icon: "error",
        });
      }
    );
  }
}
