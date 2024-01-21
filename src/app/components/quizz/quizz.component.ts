import { Component, OnInit } from '@angular/core';
import quizz_questions from "../../../assets/data/quizz_questions.json"

@Component({
  selector: 'app-quizz',
  template: `
    <div class="container__quizz">

      <div class="quizz__logo container__flex">
        <img src="assets/imgs/logo.png" alt="">
        <h3>{{title}}</h3>
      </div>

      <div class="quizz__questions container__flex" *ngIf="!finished">
        <h3>{{questionSelected.question}}</h3>
      </div>

      <div class="quizz__options container__flex" *ngIf="!finished">
        <button 
          class="btn-option"
          *ngFor="let option of questionSelected.options"
          (click)="playerChoose(option.alias)"
        >
          {{option.name}}
        </button>
      </div>

      <div class="quizz__results container__flex" *ngIf="finished">
        <h1>O Seu resultado é:</h1>
        <p>{{answerSelected}}</p>
      </div>

    </div>
  `,
  styles: [
    ".container__flex{display:flex;justify-content:center;align-items:center;}",
    ".container__quizz{width:80%;margin:auto;margin-top:20px;}",
    ".container__quizz .quizz__logo{flex-direction:column;margin-bottom:10px;}",
    ".container__quizz > .quizz__logo > img{}",
    ".container__quizz .quizz__logo > h3{margin-top:20px;}",
    ".container__quizz .quizz__questions{border:1px solid #4224d9;border-radius:8px;background:#644ED2;width:100%;height:200px;font-size:20px;margin-bottom:20px;;}",
    ".container__quizz .quizz__options{flex-wrap:wrap;margin:auto;margin-bottom:20px;}",
    ".container__quizz .quizz__options > button.btn-option{background-color:transparent;margin:10px 5px;font-size:17px;padding:16px 31px;text-decoration:none;font-family:'arial';text-shadow:0px 1px 0px #2f6627;border-radius:8px;border:1px solid #18ab29;color:var(--color);width:calc(50% - 10px);display:inline-block;cursor:pointer;}",
    ".container__quizz .quizz__options > button.btn-option:hover{background-color:#5cbf2a;}",
    ".container__quizz .quizz__options > button.btn-option:active{position:relative;top:1px;}",
    ".container__quizz .quizz__results{width:100%;height:200px;background-color:rgb(33,2,57);border-radius:10px;padding:30px;flex-direction:column;}"
  ]
})
export class QuizzComponent implements OnInit {

  title:string = "";

  questions:any
  questionSelected:any

  answers:string[] = []
  answerSelected:string = ""

  questionIndex:number = 0
  questionMaxIndex:number = 0

  finished:boolean = false

  constructor(){

  }
  ngOnInit(): void {
    if(quizz_questions){
      this.finished = false
      this.title = quizz_questions.title

      this.questions = quizz_questions.questions
      this.questionSelected = this.questions[this.questionIndex]

      this.questionIndex = 0
      this.questionMaxIndex = this.questions.length

    }
  }

  playerChoose(value:string){
    this.answers.push(value)
    this.nextStep()
  }

  async nextStep(){
    this.questionIndex++

    if(this.questionMaxIndex > this.questionIndex){
      this.questionSelected = this.questions[this.questionIndex]
    }else{
      const finalAnswer:string = await this.checkResult(this.answers)
      this.finished = true
      this.answerSelected = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results]
    }
  }

  async checkResult(anwsers:string[]){
    const result = anwsers.reduce((previous, current, i, arr)=>{
      if(arr.filter(item => item === previous).length > arr.filter(item => item === current).length){
        return previous
      }else{
        return current
      }
    })

    return result
  }
}
