import { defineStore } from 'pinia'
import exams from '../constants/testes.json'
import questions from '../constants/perguntas.json'
import alternatives from '../constants/respostas.json'

interface Exam {
	id: number
	title: string
	articles: number
	posts: number
	beetcoins: number
	finishin: boolean | null
	questions: Question[]
}

interface Question {
	id: number
	text: string
	parent_id: number
	alternatives: Alternative[]
	beetcoins: number
}

interface Alternative {
	id: number
	text: string
	question_id: number
	is_correct: boolean
}

export const useQuizStore = defineStore('quiz', {
	state: () => {
		return {
			exams: exams.map((exam: any) => {
				exam.questions = questions
					.filter((question: any) => question.parent_id == exam.id)
					.map((question: any) => {
						question.alternatives = alternatives.filter(
							(alternative: any) => alternative.question_id == question.id
						)
						return question
					})

				exam.beetcoins = exam.questions.reduce(
					(total: number, question: any) => total + question.beetcoins,
					0
				)

				return exam
			})
		}
	},
	getters: {
		unanswered(state) {
			return state.exams.filter((exam) => !exam.finishin)
		},
		answered(state) {
			return state.exams.filter((exam) => exam.finishin)
		},
		show: (state) => (id: number) => {
			return state.exams.find((exam) => exam.id == id)
		},
		setFinishin: (state) => (id: number, finishin: boolean) => {
			const exam = state.exams.find((exam) => exam.id == id)
			exam.finishin = finishin
		},
		setScore: (state) => (id: number, score: number) => {
			const exam = state.exams.find((exam) => exam.id == id)
			exam.score = score
		},
		setAnswers: (state) => (id: number, answers: any) => {
			const exam = state.exams.find((exam) => exam.id == id)
			exam.answers = answers
		}
	}
})
