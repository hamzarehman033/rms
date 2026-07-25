import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { Menu } from '../../../core/constants/sideMenu';
import { AuthService } from '../../../core/services/auth.service';
import { AppRole } from '../../../core/constants/roles';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  hasActiveCustomer = false;
  private readonly destroyRef = inject(DestroyRef);

  Menu = Menu;
  userModules: number[] = [];
  isSysAdmin = false;

  constructor(private customerService: CustomerService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userModules = this.authService.getCurrentUserModules();
    this.customerService.activeCustomer$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(activeCustomer => {
        this.hasActiveCustomer = !!activeCustomer?.id;
      });
    this.isSysAdmin = this.authService.hasRole(AppRole.SysAdmin);
  }

  userHasModule(moduleId: number): boolean {
    return this.userModules.includes(moduleId) || this.isSysAdmin;
  }

}
