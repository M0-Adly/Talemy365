import { revalidatePath } from 'next/cache'

export function revalidateAll() {
  revalidatePath('/', 'layout')
}

export function revalidateCourses() {
  revalidatePath('/curriculum', 'page')
  revalidatePath('/foundation', 'page')
  revalidatePath('/', 'page')
  revalidatePath('/mudir/courses', 'page')
  revalidatePath('/mudir', 'page')
}

export function revalidateCourse(id: string) {
  revalidateCourses()
  revalidatePath(`/curriculum/${id}`, 'page')
  revalidatePath(`/mudir/courses/${id}`, 'page')
  revalidatePath(`/mudir/courses/${id}/contents`, 'page')
}

export function revalidateInquiries() {
  revalidatePath('/mudir/contact-submissions', 'page')
  revalidatePath('/mudir', 'page')
}
