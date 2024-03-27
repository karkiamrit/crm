import Link from 'next/link';
// import Image from 'next/image';
import comments from '../data/comment';
import { Separator } from "@/components/ui/separator"
import { Textarea } from '@/components/ui/textarea';

const LeadNote = () => {
  return (
    <section className="bg-white dark:bg-gray-900 py-8 rounded-lg  antialiased">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg lg:text-2xl pl-6 font-bold text-gray-900 dark:text-white">Notes ({comments.length})</h2>
        </div>
        <Separator />
        {comments.map((comment) => (
          <article key={comment.id} className="p-6 text-base bg-white rounded-lg dark:bg-gray-900">
            <footer className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">
                  {/* <Image className="mr-2 w-6 h-6 rounded-full" src={comment.author.avatar} alt={comment.author.name} width={24} height={24} /> */}
                  {comment.author.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <time  dateTime={comment.date} title={comment.date}>{comment.date}</time>
                </p>
              </div>
              <button
                id={`dropdownComment${comment.id}Button`}
                data-dropdown-toggle={`dropdownComment${comment.id}`}
                className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-500 dark:text-gray-400 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                type="button"
              >
                <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                  <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                </svg>
                <span className="sr-only">Comment settings</span>
              </button>
              {/* Dropdown menu */}
              <div id={`dropdownComment${comment.id}`} className="hidden z-10 w-36 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby={`dropdownComment${comment.id}Button`}>
                  <li>
                    <Link href="#">
                      <div className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Edit</div>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <div className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Remove</div>
                    </Link>
                  </li>
                  <li>
                    <Link href="#">
                      <div className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Report</div>
                    </Link>
                  </li>
                </ul>
              </div>
            </footer>
            <p className="text-gray-500 dark:text-gray-400">{comment.content}</p>
       
          </article>
        ))}
        <div className='pl-6 mt-4'><Textarea placeholder='Add A Note' className='resize-none h-24'/></div>
      </div>
    </section>
  );
};

export default LeadNote;
