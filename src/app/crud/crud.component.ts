import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  DocumentData,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss'],
})
export class CrudComponent implements OnInit {
  title = 'AngularFirebase';
  userData!: FormGroup;
  userList!: Observable<any>;
  isEdit: boolean = false;
  updateId!: any;
  submitted = false;
  isLoading = false;
  options = [
    { key: 'male', value: 'Male' },
    { key: 'female', value: 'Female' },
    { key: 'other', value: 'Other' },
  ];

  constructor(private fb: FormBuilder, private firestore: Firestore) {}

  ngOnInit(): void {
    this.userData = this.fb.group({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      dob: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
    });

    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.getData();
    }, 500);
  }

  getData() {
    const collectionInstance = collection(this.firestore, 'UserDetails');
    collectionData(collectionInstance, { idField: 'id' }).subscribe(() => {});
    this.userList = collectionData(collectionInstance, { idField: 'id' });
  }

  addData() {
    const collectionInstance = collection(this.firestore, 'UserDetails');
    addDoc(collectionInstance, this.userData.value)
      .then((res) => {
        this.userData.reset();
      })
      .catch((error) => {
        console.log('Error ====>', error);
      });

    this.userData.reset();
    this.submitted = false;
    this.isLoading = false;
  }

  editData() {
    console.log(this.userData.value);
    console.log(this.updateId);
    const docInstance = doc(this.firestore, 'UserDetails', this.updateId);
    updateDoc(docInstance, this.userData.value);
    this.resetForm();
  }

  action(type: string, index: any, data: any) {
    if (type == 'edit') {
      this.userData.setValue({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        dob: data.dob,
        gender: data.gender,
        mobile: data.mobile,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
      });
      this.isEdit = true;
    } else if (type == 'delete') {
      alert('Are you sure to Delete Data!!!......');
      const docInstance = doc(this.firestore, 'UserDetails', index);
      deleteDoc(docInstance)
        .then(() => {
          console.log('Data Deleted');
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log('Call Wrong Function......');
    }
    this.updateId = index;
  }

  Submit() {
    this.submitted = true;
    console.log(this.userData.value);
    if (this.userData.invalid) {
      return;
    }
    this.isEdit ? this.editData() : this.addData();
  }

  resetForm() {
    this.userData.reset();
    this.submitted = false;
    this.isEdit = false;
  }
}

/*   
    updateData(id: any) {
    this.isEdit = true;
    this.userList.subscribe((res) => {
      res.forEach((ele: any) => {
        if (ele.id === id) {
          this.userData.patchValue({
            name: ele.name,
            email: ele.email,
          });
        }
      });
    });
    this.updateId = id;
    console.log(this.updateId);
  }

  deleteData(id: any) {
    const docInstance = doc(this.firestore, 'UserDetails', id);
    deleteDoc(docInstance)
      .then(() => {
        console.log('Data Deleted');
      })
      .catch((err) => {
        console.log(err);
      });
  }
*/
