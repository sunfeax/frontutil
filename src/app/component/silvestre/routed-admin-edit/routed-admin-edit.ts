import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SilvestreService } from '../../../service/silvestre';
import { ISilvestre } from '../../../model/silvestre';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-routed-admin-edit',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './routed-admin-edit.html',
    styleUrl: './routed-admin-edit.css',
})
export class RoutedAdminEdit implements OnInit {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private silvestreService = inject(SilvestreService);

    silvestreForm!: FormGroup;
    silvestreId: number | null = null;
    loading: boolean = true;
    error: string | null = null;
    submitting: boolean = false;
    private originalSilvestre: ISilvestre | null = null;

    ngOnInit(): void {
        this.initForm();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.silvestreId = +id;
            this.loadSilvestre(+id);
        } else {
            this.loading = false;
            this.error = 'ID de post no válido';
        }
    }

    initForm(): void {
        this.silvestreForm = this.fb.group({
            titulo: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(200)]],
            descripcion: ['', [
                Validators.required,
                Validators.minLength(10)]],
            urlImagen: ['', [Validators.maxLength(100)]],
        });
    }

    loadSilvestre(id: number): void {
        this.silvestreService.get(id).subscribe({
            next: (silvestre: ISilvestre) => {
                this.originalSilvestre = silvestre;
                this.silvestreForm.patchValue({
                    titulo: silvestre.titulo,
                    descripcion: silvestre.descripcion,
                    urlImagen: silvestre.urlImagen,
                });
                this.loading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.error = 'Error al cargar el post';
                this.loading = false;
                console.error(err);
            },
        });
    }

    onSubmit(): void {
        if (!this.silvestreForm.valid || !this.silvestreId) {
            this.silvestreForm.markAllAsTouched();
            return;
        }

        this.submitting = true;
        const payload: Partial<ISilvestre> = {
            id: this.silvestreId!,
            titulo: this.silvestreForm.value.titulo,
            descripcion: this.silvestreForm.value.descripcion,
            urlImagen: this.silvestreForm.value.urlImagen
        };

        this.silvestreService.update(payload).subscribe({
            next: () => {
                this.submitting = false;
                // antes: this.router.navigate(['/blog/plist']);
                this.router.navigate(['/silvestre/plist']);
            },
            error: (err: HttpErrorResponse) => {
                this.submitting = false;
                this.error = 'Error al guardar el post';
                console.error(err);
            },
        });
    }

    get titulo() {
        return this.silvestreForm.get('titulo');
    }

    get descripcion() {
        return this.silvestreForm.get('descripcion');
    }

    get urlImagen() {
        return this.silvestreForm.get('urlImagen');
    }
}
