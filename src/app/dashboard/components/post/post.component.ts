import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { LikeService, PostService } from 'src/app/services';
import { Comment, Post, User } from 'src/app/interfaces';
import { DocumentReference } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css'],
})
export class PostComponent implements OnInit {
  @Input() post!: Post;
  @Input() currentUser!: User;
  user!: User;
  usersLiked: User[] = [];
  timeAgo: string = '';
  comments: Comment[] = [];
  likes: any[] = [];
  photoUrl: string = 'assets/no-image.png';
  isLiked: boolean = false;
  isDisabled: boolean = false;
  showComments: boolean = false;
  modalRef?: BsModalRef;

  commentForm = this.fb.group({
    comment: ['', [Validators.required, Validators.maxLength(150)]],
  });

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private postService: PostService,
    private likeService: LikeService
  ) {}

  ngOnInit(): void {
    this.post.idUser.get().then((doc: any) => {
      const user = doc.data();
      this.user = user;
      this.photoUrl = user.photoUrl || 'assets/no-image.png';
      this.getComments();
      this.getLikes();
      this.timeAgo = moment(this.post.createdAt.toDate())
        .locale('es')
        .fromNow();
    });
  }

  deletePost() {
    this.postService.deletePost(this.post.idPost);
  }

  getComments() {
    this.postService
      .getCommentsFromPost(this.post.idPost)
      .subscribe((comments) => {
        this.comments = comments;
      });
  }

  getLikes() {
    this.likes = this.post.likes?.map((like) => like.id) || [];
    this.post.likes?.forEach((like: DocumentReference) => {
      like.get().then((doc: any) => this.usersLiked.push(doc.data()));
    });
  }

  addLike() {
    this.isDisabled = true;
    this.isLiked = true;
    this.likes.push(this.currentUser.idUser);
    this.usersLiked.push(this.currentUser);
    this.likeService
      .addLike(this.post.idPost, this.currentUser.idUser)
      .then(() => {
        this.isDisabled = false;
      });
  }

  removeLike() {
    this.isDisabled = true;
    this.isLiked = false;
    this.likes = this.likes.filter((like) => like !== this.currentUser.idUser);
    this.usersLiked = this.usersLiked.filter(
      (user) => user.idUser !== this.currentUser.idUser
    );
    this.likeService
      .removeLike(this.post.idPost, this.currentUser.idUser)
      .then(() => {
        this.isDisabled = false;
      });
  }

  addComment() {
    const commentBody = this.commentForm.get('comment')?.value;
    this.commentForm.reset();
    this.postService.addComment(
      this.post.idPost,
      this.currentUser.idUser,
      commentBody!
    );
  }

  deleteComment(idComment: string) {
    this.postService.deleteComment(this.post.idPost, idComment);
  }

  openModal(template: TemplateRef<any>, modalClass: string) {
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered ' + modalClass,
    });
  }

  closeModal() {
    this.modalRef?.hide();
  }
}
