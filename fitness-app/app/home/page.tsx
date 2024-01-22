import Navigation from "@/components/Navigation"

export default function HomePage() {
  return (
    <div>
      <Navigation />

      <div className="bg-white rounded-lg container mx-auto my-8 p-4 max-w-xl shadow-md">
        <h1 className="text-4xl font-semibold text-gray-800 mb-4">
          Welcome to HabitKick!
        </h1>
        <p className="text-gray-700 text-lg">
          Welcome to our innovative fitness and wellness app! We provide a
          dynamic platform that empowers you to engage in friendly competitions,
          stay motivated, and transform your approach to fitness challenges.
          Whether you're a fitness enthusiast or a beginner, our app is designed
          to inspire and guide you on your journey to a healthier and more
          active lifestyle. Join us today and kickstart your fitness adventure!
        </p>
      </div>

      <footer className=" py-4">
        <div className="container mx-auto text-center">
          <p className="text-gray-600">
            &copy; {new Date().getFullYear()} FitnessApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
