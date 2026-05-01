import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ToastService } from "./core/services/toast.service";
import { initializeGlobalToast } from "./utils/global-toast";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    initializeGlobalToast(this.toastService);
  }
}
