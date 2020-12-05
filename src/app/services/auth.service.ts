import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UsuarioModel } from "../models/usuario.model";

import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private url = "https://identitytoolkit.googleapis.com/v1/accounts:";
  private apiKey = "AIzaSyAvOqYkrLKCpzq0hICgY0cLZKtDNeI0TL4";

  userToken: string;
  // expiresIn: string;

  // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  // crear Nuevo Usuario

  // https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
  // login

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  logOut() {
    localStorage.removeItem("token");
  }

  logIn(usuario: UsuarioModel) {
    const authData = {
      // email: usuario.email,
      // password: usuario.password,
      ...usuario,
      returnSecureToken: true,
    };

    return this.http
      .post(`${this.url}signInWithPassword?key=${this.apiKey}`, authData)
      .pipe(this.mapToken());
  }

  nuevoUsuario(usuario: UsuarioModel) {
    const authData = {
      // email: usuario.email,
      // password: usuario.password,
      ...usuario,
      returnSecureToken: true,
    };

    return this.http
      .post(`${this.url}signUp?key=${this.apiKey}`, authData)
      .pipe(this.mapToken());
  }

  private mapToken() {
    return map((respuesta: any) => {
      console.log("Entro en el mapa del RXJS");

      this.guardarToken(respuesta.idToken, respuesta.expiresIn);
      return respuesta;
    });
  }

  private guardarToken(idToken: string, expiresIn: string) {
    this.userToken = idToken;
    localStorage.setItem("token", idToken);

    const hoy = new Date();
    hoy.setSeconds(Number(expiresIn));
    // this.expiresIn = hoy.getTime().toString();
    localStorage.setItem("expiresIn", hoy.getTime().toString());
  }

  private leerToken() {
    if (localStorage.getItem("token")) {
      this.userToken = localStorage.getItem("token");
    } else {
      this.userToken = "";
    }

    return this.userToken;
  }

  estaAutenticado(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem("expiresIn"));

    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }

    // return this.userToken.length > 2;
  }
}
