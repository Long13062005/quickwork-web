/**
 * Language Context for Vietnamese/English switching
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'vi' | 'en' | 'ja';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations = {
  vi: {
    // Header
    'header.findJobs': 'Tìm việc làm',
    'header.companies': 'Công ty',
    'header.careerAdvice': 'Tư vấn nghề nghiệp',
    'header.signIn': 'Đăng nhập',
    'header.signUp': 'Đăng ký',
    'header.dashboard': 'Dashboard',
    
    // Hero Section
    'hero.title': 'Tìm công việc mơ ước',
    'hero.subtitle': 'Kết nối với hàng nghìn cơ hội việc làm từ các công ty hàng đầu',
    'hero.searchPlaceholder': 'Chức danh, kỹ năng, hoặc công ty',
    'hero.locationPlaceholder': 'Thành phố, tỉnh thành',
    'hero.searchButton': '🔍 Tìm việc',
    'hero.popularSearches': 'Tìm kiếm phổ biến:',
    
    // Popular searches
    'search.softwareEngineer': 'Kỹ sư phần mềm',
    'search.marketingManager': 'Quản lý Marketing',
    'search.dataAnalyst': 'Phân tích dữ liệu',
    'search.productManager': 'Quản lý sản phẩm',
    'search.uxDesigner': 'Thiết kế UX',
    'search.salesRep': 'Nhân viên bán hàng',
    
    // Stats
    'stats.jobsDaily': 'Việc làm mỗi ngày',
    'stats.companies': 'Công ty tuyển dụng',
    'stats.candidates': 'Ứng viên đăng ký',
    'stats.satisfaction': 'Tỷ lệ hài lòng',
    
    // Featured Companies
    'companies.title': 'Công ty hàng đầu đang tuyển dụng',
    'companies.subtitle': 'Khám phá cơ hội nghề nghiệp tại các tập đoàn lớn',
    'companies.jobs': 'việc làm',
    
    // Job Categories
    'categories.title': 'Khám phá theo ngành nghề',
    'categories.subtitle': 'Tìm kiếm cơ hội trong lĩnh vực bạn quan tâm',
    'categories.it': 'Công nghệ thông tin',
    'categories.finance': 'Tài chính - Ngân hàng',
    'categories.healthcare': 'Y tế - Dược phẩm',
    'categories.education': 'Giáo dục - Đào tạo',
    'categories.manufacturing': 'Sản xuất - Chế tạo',
    'categories.retail': 'Bán lẻ - Thương mại',
    'categories.marketing': 'Marketing - Truyền thông',
    'categories.legal': 'Luật - Pháp lý',
    'categories.jobCount': 'việc làm',
    
    // How it Works
    'howItWorks.title': 'Tìm việc chỉ với 3 bước đơn giản',
    'howItWorks.subtitle': 'Quy trình nhanh chóng và hiệu quả',
    'howItWorks.step1.title': 'Tạo hồ sơ',
    'howItWorks.step1.description': 'Xây dựng hồ sơ chuyên nghiệp với thông tin chi tiết về kinh nghiệm và kỹ năng',
    'howItWorks.step2.title': 'Tìm kiếm & Ứng tuyển',
    'howItWorks.step2.description': 'Khám phá hàng nghìn cơ hội việc làm và ứng tuyển chỉ với một cú click',
    'howItWorks.step3.title': 'Nhận được công việc',
    'howItWorks.step3.description': 'Kết nối trực tiếp với nhà tuyển dụng và bắt đầu sự nghiệp mới',
    'howItWorks.getStarted': '🚀 Bắt đầu ngay hôm nay',
    
    // Footer
    'footer.description': 'Nền tảng tuyển dụng hàng đầu Việt Nam, kết nối nhân tài với cơ hội.',
    'footer.forCandidates': 'Dành cho ứng viên',
    'footer.findJobs': 'Tìm việc làm',
    'footer.createCV': 'Tạo CV',
    'footer.careerAdvice': 'Tư vấn nghề nghiệp',
    'footer.salary': 'Lương Việt Nam',
    'footer.forEmployers': 'Dành cho nhà tuyển dụng',
    'footer.postJobs': 'Đăng tuyển dụng',
    'footer.findCandidates': 'Tìm ứng viên',
    'footer.hrServices': 'Dịch vụ HR',
    'footer.marketReport': 'Báo cáo thị trường',
    'footer.aboutUs': 'Về Quickwork',
    'footer.about': 'Giới thiệu',
    'footer.contact': 'Liên hệ',
    'footer.terms': 'Điều khoản',
    'footer.privacy': 'Bảo mật',
    'footer.copyright': 'Tất cả quyền được bảo lưu.',
    'footer.madeWith': 'Made with ❤️ in Vietnam',
    
    // Authentication - Login
    'auth.login.title': 'Chào mừng trở lại',
    'auth.login.subtitle': 'Vui lòng đăng nhập vào tài khoản của bạn',
    'auth.login.email': 'Địa chỉ Email',
    'auth.login.password': 'Mật khẩu',
    'auth.login.emailPlaceholder': 'Nhập email của bạn',
    'auth.login.passwordPlaceholder': 'Nhập mật khẩu của bạn',
    'auth.login.button': 'Đăng nhập',
    'auth.login.forgotPassword': 'Quên mật khẩu?',
    'auth.login.noAccount': 'Chưa có tài khoản?',
    'auth.login.signUp': 'Đăng ký ngay',
    'auth.login.success': 'Đăng nhập thành công ✨',
    'auth.login.error': 'Đăng nhập thất bại ❌',
    'auth.login.errorFixMessage': 'Vui lòng khắc phục các lỗi sau:',
    
    // Authentication - Register
    'auth.register.title': 'Tạo tài khoản mới',
    'auth.register.subtitle': 'Bắt đầu hành trình nghề nghiệp của bạn',
    'auth.register.email': 'Địa chỉ Email',
    'auth.register.password': 'Mật khẩu',
    'auth.register.confirmPassword': 'Xác nhận mật khẩu',
    'auth.register.emailPlaceholder': 'Nhập email của bạn',
    'auth.register.passwordPlaceholder': 'Tạo mật khẩu mạnh',
    'auth.register.confirmPasswordPlaceholder': 'Xác nhận mật khẩu',
    'auth.register.button': 'Tạo tài khoản',
    'auth.register.haveAccount': 'Đã có tài khoản?',
    'auth.register.signIn': 'Đăng nhập',
    'auth.register.success': 'Đăng ký thành công ✨',
    'auth.register.error': 'Đăng ký thất bại ❌',
    'auth.register.errorFixMessage': 'Vui lòng khắc phục các lỗi sau:',
    
    // Common validation messages
    'validation.required': 'Trường này bắt buộc',
    'validation.email.invalid': 'Email không hợp lệ',
    'validation.email.required': 'Email là bắt buộc',
    'validation.password.required': 'Mật khẩu là bắt buộc',
    'validation.password.min': 'Mật khẩu tối thiểu 6 ký tự',
    'validation.password.confirm': 'Xác nhận mật khẩu không khớp',
    'validation.password.strength.weak': 'Yếu',
    'validation.password.strength.fair': 'Trung bình',
    'validation.password.strength.good': 'Tốt',
    'validation.password.strength.strong': 'Mạnh',
    'validation.email.exists': 'Email đã tồn tại',
    'validation.email.available': 'Email khả dụng',
    'validation.email.checking': 'Đang kiểm tra...',
    
    // Dashboard - User
    'dashboard.user.welcomeBack': 'Chào mừng trở lại, {name}!',
    'dashboard.user.readyToFind': 'Sẵn sàng tìm cơ hội tiếp theo?',
    'dashboard.user.jobSeekerProfile': 'Hồ sơ Người tìm việc',
    'dashboard.user.employerProfile': 'Hồ sơ Nhà tuyển dụng',
    'dashboard.user.adminProfile': 'Hồ sơ Quản trị viên',
    'dashboard.user.userProfile': 'Hồ sơ Người dùng',
    'dashboard.user.loadingProfile': 'Đang tải hồ sơ...',
    'dashboard.user.logout': 'Đăng xuất',
    'dashboard.user.editProfile': 'Chỉnh sửa hồ sơ của bạn',
    'dashboard.user.loggingOut': 'Đang đăng xuất...',
    'dashboard.user.logoutFailed': 'Đăng xuất thất bại. Vui lòng thử lại.',
    
    // Dashboard - Stats
    'dashboard.stats.profileViews': 'Lượt xem hồ sơ',
    'dashboard.stats.applications': 'Đơn ứng tuyển',
    'dashboard.stats.interviews': 'Phỏng vấn',
    'dashboard.stats.profileComplete': 'Hoàn thành hồ sơ',
    'dashboard.stats.activeJobs': 'Việc làm đang hoạt động',
    'dashboard.stats.totalApplications': 'Tổng đơn ứng tuyển',
    'dashboard.stats.candidates': 'Ứng viên',
    'dashboard.stats.hires': 'Tuyển dụng',
    
    // Dashboard - Job Recommendations
    'dashboard.jobs.recommendedJobs': 'Việc làm được đề xuất',
    'dashboard.jobs.viewAll': 'Xem tất cả',
    'dashboard.jobs.match': 'phù hợp',
    'dashboard.jobs.apply': 'Ứng tuyển',
    'dashboard.jobs.fullTime': 'Toàn thời gian',
    'dashboard.jobs.partTime': 'Bán thời gian',
    'dashboard.jobs.contract': 'Hợp đồng',
    'dashboard.jobs.remote': 'Từ xa',
    
    // Dashboard - Quick Actions
    'dashboard.actions.quickActions': 'Thao tác nhanh',
    'dashboard.actions.browseJobs': 'Duyệt việc làm',
    'dashboard.actions.editProfile': 'Chỉnh sửa hồ sơ',
    'dashboard.actions.viewApplications': 'Xem đơn ứng tuyển',
    'dashboard.actions.updateResume': 'Cập nhật CV',
    'dashboard.actions.postJob': 'Đăng tuyển dụng',
    'dashboard.actions.manageCandidates': 'Quản lý ứng viên',
    'dashboard.actions.viewAnalytics': 'Xem phân tích',
    'dashboard.actions.manageJobs': 'Quản lý việc làm',
    'dashboard.actions.changePassword': 'Đổi mật khẩu',
    
    // Dashboard - Recent Activity
    'dashboard.activity.recentApplications': 'Đơn ứng tuyển gần đây',
    'dashboard.activity.recentCandidates': 'Ứng viên gần đây',
    'dashboard.activity.appliedAt': 'Ứng tuyển vào',
    'dashboard.activity.pending': 'Chờ xử lý',
    'dashboard.activity.reviewing': 'Đang xem xét',
    'dashboard.activity.interview': 'Phỏng vấn',
    'dashboard.activity.rejected': 'Từ chối',
    'dashboard.activity.accepted': 'Chấp nhận',
    'dashboard.activity.hired': 'Đã tuyển',
    'dashboard.activity.new': 'Mới',
    'dashboard.activity.noApplications': 'Chưa có đơn ứng tuyển nào',
    'dashboard.activity.noCandidates': 'Chưa có ứng viên nào',
    
    // Dashboard - Employer Specific
    'dashboard.employer.welcomeBack': 'Chào mừng trở lại, {name}!',
    'dashboard.employer.readyToHire': 'Sẵn sàng tuyển dụng nhân tài?',
    'dashboard.employer.jobPostings': 'Bài đăng tuyển dụng',
    'dashboard.employer.candidatePool': 'Nhóm ứng viên',
    'dashboard.employer.hiringPipeline': 'Quy trình tuyển dụng',
    'dashboard.employer.companyProfile': 'Hồ sơ công ty',
    'dashboard.employer.active': 'Hoạt động',
    'dashboard.employer.paused': 'Tạm dừng',
    'dashboard.employer.closed': 'Đóng',
    'dashboard.employer.viewDetails': 'Xem chi tiết',
    'dashboard.employer.editJob': 'Chỉnh sửa',
    'dashboard.employer.viewCandidates': 'Xem ứng viên',
    
    // Dashboard - Admin Specific
    'dashboard.admin.title': 'Bảng Điều Khiển Quản Trị',
    'dashboard.admin.subtitle': 'Quản lý hệ thống và quản trị người dùng',
    'dashboard.admin.totalUsers': 'Tổng Số Người Dùng',
    'dashboard.admin.totalJobs': 'Tổng Số Việc Làm',
    'dashboard.admin.newSignups': 'Đăng Ký Mới',
    'dashboard.admin.activeJobs': 'Việc Làm Đang Hoạt Động',
    'dashboard.admin.flaggedContent': 'Nội Dung Được Gắn Cờ',
    'dashboard.admin.systemHealth': 'Tình Trạng Hệ Thống',
    'dashboard.admin.recentUsers': 'Người Dùng Gần Đây',
    'dashboard.admin.viewAllUsers': 'Xem Tất Cả Người Dùng',
    'dashboard.admin.user': 'Người Dùng',
    'dashboard.admin.role': 'Vai Trò',
    'dashboard.admin.status': 'Trạng Thái',
    'dashboard.admin.lastActive': 'Hoạt Động Cuối',
    'dashboard.admin.actions': 'Hành Động',
    'dashboard.admin.view': 'Xem',
    'dashboard.admin.adminActions': 'Hành Động Quản Trị',
    'dashboard.admin.createUser': 'Tạo Người Dùng',
    'dashboard.admin.manageRoles': 'Quản Lý Vai Trò',
    'dashboard.admin.reviewJobs': 'Xem Xét Việc Làm',
    'dashboard.admin.viewAnalytics': 'Xem Phân Tích',
    'dashboard.admin.updateProfile': 'Cập Nhật Hồ Sơ',
    'dashboard.admin.changePassword': 'Thay Đổi Mật Khẩu',
    'dashboard.admin.systemSettings': 'Cài Đặt Hệ Thống',
    'dashboard.admin.quickStats': 'Thống Kê Nhanh',
    'dashboard.admin.storageUsage': 'Sử Dụng Lưu Trữ',
    'dashboard.admin.apiUsage': 'Sử Dụng API',
    'dashboard.admin.databaseLoad': 'Tải Cơ Sở Dữ Liệu',
    'dashboard.admin.logout': 'Đăng Xuất',
    'dashboard.admin.jobseeker': 'Người Tìm Việc',
    'dashboard.admin.employer': 'Nhà Tuyển Dụng',
    'dashboard.admin.admin': 'Quản Trị Viên',
    'dashboard.admin.active': 'Hoạt Động',
    'dashboard.admin.inactive': 'Không Hoạt Động',
    'dashboard.admin.pending': 'Đang Chờ',
    'dashboard.admin.banned': 'Bị Cấm',
    
    // Job Listing
    'jobs.findDreamJob': 'Tìm Công Việc Mơ Ước',
    'jobs.discoverOpportunities': 'Khám phá cơ hội từ các công ty hàng đầu và tiến bước trong sự nghiệp',
    'jobs.searchResults': 'Kết Quả Tìm Kiếm',
    'jobs.allJobs': 'Tất Cả Công Việc',
    'jobs.jobsFound': 'công việc được tìm thấy',
    'jobs.keywords': 'Từ khóa',
    'jobs.location': 'Địa điểm',
    'jobs.type': 'Loại',
    'jobs.minSalary': 'Lương tối thiểu',
    'jobs.maxSalary': 'Lương tối đa',
    'jobs.searchingJobs': 'Đang tìm kiếm công việc...',
    'jobs.loadingJobs': 'Đang tải công việc...',
    'jobs.noJobsFound': 'Không tìm thấy công việc',
    'jobs.adjustSearchCriteria': 'Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc duyệt tất cả công việc có sẵn',
    'jobs.viewAllJobs': 'Xem Tất Cả Công Việc',
    'jobs.loadMoreJobs': 'Tải Thêm Công Việc',
    
    // Job Card
    'jobs.company': 'Công ty',
    'jobs.expired': 'Hết hạn',
    'jobs.today': 'Hôm nay',
    'jobs.yesterday': 'Hôm qua',
    'jobs.tomorrow': 'Ngày mai',
    'jobs.daysAgo': '{days} ngày trước',
    'jobs.weeksAgo': '{weeks} tuần trước',
    'jobs.daysLeft': '{days} ngày còn lại',
    'jobs.weeksLeft': '{weeks} tuần còn lại',
    'jobs.requiredSkills': 'Kỹ năng yêu cầu:',
    'jobs.moreSkills': '+{count} kỹ năng khác',
    
    // BeforeAuth - Email Check
    'beforeAuth.title': 'Bắt đầu',
    'beforeAuth.subtitle': 'Nhập email để tiếp tục vào tài khoản của bạn',
    'beforeAuth.emailPlaceholder': 'Nhập địa chỉ email của bạn',
    'beforeAuth.continue': 'Tiếp tục',
    'beforeAuth.or': 'Hoặc',
    'beforeAuth.signInWith': 'Đăng nhập với',
    'beforeAuth.signUpWith': 'Đăng ký với',
    'beforeAuth.google': 'Google',
    'beforeAuth.facebook': 'Facebook',
    'beforeAuth.redirectingLogin': 'Đang chuyển hướng đến đăng nhập... 🔑',
    'beforeAuth.redirectingRegister': 'Đang chuyển hướng đến đăng ký... ✨',
    'beforeAuth.emailCheckFailed': 'Kiểm tra email thất bại ❌',
    'beforeAuth.errorFixMessage': 'Vui lòng khắc phục các lỗi sau:',
    'beforeAuth.orContinueWith': 'hoặc tiếp tục với',
    'beforeAuth.comingSoon': 'Sắp ra mắt',
    'beforeAuth.backToHome': 'Về Trang Chủ',
    
    // Auth Forms
    'auth.back': 'Quay lại',
  },
  en: {
    // Header
    'header.findJobs': 'Find Jobs',
    'header.companies': 'Companies',
    'header.careerAdvice': 'Career Advice',
    'header.signIn': 'Sign In',
    'header.signUp': 'Sign Up',
    'header.dashboard': 'Dashboard',
    
    // Hero Section
    'hero.title': 'Find Your Dream Job',
    'hero.subtitle': 'Connect with thousands of job opportunities from top companies',
    'hero.searchPlaceholder': 'Job title, skills, or company',
    'hero.locationPlaceholder': 'City, state',
    'hero.searchButton': '🔍 Find Jobs',
    'hero.popularSearches': 'Popular searches:',
    
    // Popular searches
    'search.softwareEngineer': 'Software Engineer',
    'search.marketingManager': 'Marketing Manager',
    'search.dataAnalyst': 'Data Analyst',
    'search.productManager': 'Product Manager',
    'search.uxDesigner': 'UX Designer',
    'search.salesRep': 'Sales Representative',
    
    // Stats
    'stats.jobsDaily': 'Jobs daily',
    'stats.companies': 'Hiring companies',
    'stats.candidates': 'Registered candidates',
    'stats.satisfaction': 'Satisfaction rate',
    
    // Featured Companies
    'companies.title': 'Top Companies Hiring Now',
    'companies.subtitle': 'Discover career opportunities at leading corporations',
    'companies.jobs': 'jobs',
    
    // Job Categories
    'categories.title': 'Explore by Industry',
    'categories.subtitle': 'Find opportunities in your field of interest',
    'categories.it': 'Information Technology',
    'categories.finance': 'Finance & Banking',
    'categories.healthcare': 'Healthcare & Pharmaceuticals',
    'categories.education': 'Education & Training',
    'categories.manufacturing': 'Manufacturing',
    'categories.retail': 'Retail & Commerce',
    'categories.marketing': 'Marketing & Communications',
    'categories.legal': 'Legal & Law',
    'categories.jobCount': 'jobs',
    
    // How it Works
    'howItWorks.title': 'Find Jobs in Just 3 Simple Steps',
    'howItWorks.subtitle': 'Quick and efficient process',
    'howItWorks.step1.title': 'Create Profile',
    'howItWorks.step1.description': 'Build a professional profile with detailed information about your experience and skills',
    'howItWorks.step2.title': 'Search & Apply',
    'howItWorks.step2.description': 'Discover thousands of job opportunities and apply with just one click',
    'howItWorks.step3.title': 'Get Hired',
    'howItWorks.step3.description': 'Connect directly with employers and start your new career',
    'howItWorks.getStarted': '🚀 Get Started Today',
    
    // Footer
    'footer.description': 'Vietnam\'s leading recruitment platform, connecting talent with opportunities.',
    'footer.forCandidates': 'For Candidates',
    'footer.findJobs': 'Find Jobs',
    'footer.createCV': 'Create CV',
    'footer.careerAdvice': 'Career Advice',
    'footer.salary': 'Salary Guide',
    'footer.forEmployers': 'For Employers',
    'footer.postJobs': 'Post Jobs',
    'footer.findCandidates': 'Find Candidates',
    'footer.hrServices': 'HR Services',
    'footer.marketReport': 'Market Report',
    'footer.aboutUs': 'About Quickwork',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy',
    'footer.copyright': 'All rights reserved.',
    'footer.madeWith': 'Made with ❤️ in Vietnam',
    
    // Authentication - Login
    'auth.login.title': 'Welcome Back',
    'auth.login.subtitle': 'Please sign in to your account',
    'auth.login.email': 'Email Address',
    'auth.login.password': 'Password',
    'auth.login.emailPlaceholder': 'Enter your email',
    'auth.login.passwordPlaceholder': 'Enter your password',
    'auth.login.button': 'Sign In',
    'auth.login.forgotPassword': 'Forgot Password?',
    'auth.login.noAccount': 'Don\'t have an account?',
    'auth.login.signUp': 'Sign Up',
    'auth.login.success': 'Login successful ✨',
    'auth.login.error': 'Login failed ❌',
    'auth.login.errorFixMessage': 'Please fix the following errors:',
    
    // Authentication - Register
    'auth.register.title': 'Create New Account',
    'auth.register.subtitle': 'Start your career journey',
    'auth.register.email': 'Email Address',
    'auth.register.password': 'Password',
    'auth.register.confirmPassword': 'Confirm Password',
    'auth.register.emailPlaceholder': 'Enter your email',
    'auth.register.passwordPlaceholder': 'Create strong password',
    'auth.register.confirmPasswordPlaceholder': 'Confirm your password',
    'auth.register.button': 'Create Account',
    'auth.register.haveAccount': 'Already have an account?',
    'auth.register.signIn': 'Sign In',
    'auth.register.success': 'Registration successful ✨',
    'auth.register.error': 'Registration failed ❌',
    'auth.register.errorFixMessage': 'Please fix the following errors:',
    
    // Common validation messages
    'validation.required': 'This field is required',
    'validation.email.invalid': 'Invalid Email',
    'validation.email.required': 'Email is required',
    'validation.password.required': 'Password is required',
    'validation.password.min': 'Min password is 6 characters',
    'validation.password.confirm': 'Passwords do not match',
    'validation.password.strength.weak': 'Weak',
    'validation.password.strength.fair': 'Fair',
    'validation.password.strength.good': 'Good',
    'validation.password.strength.strong': 'Strong',
    'validation.email.exists': 'Email already exists',
    'validation.email.available': 'Email available',
    'validation.email.checking': 'Checking...',
    
    // Dashboard - User
    'dashboard.user.welcomeBack': 'Welcome back, {name}!',
    'dashboard.user.readyToFind': 'Ready to find your next opportunity?',
    'dashboard.user.jobSeekerProfile': 'Job Seeker Profile',
    'dashboard.user.employerProfile': 'Employer Profile',
    'dashboard.user.adminProfile': 'Admin Profile',
    'dashboard.user.userProfile': 'User Profile',
    'dashboard.user.loadingProfile': 'Loading profile...',
    'dashboard.user.logout': 'Logout',
    'dashboard.user.editProfile': 'Edit your profile',
    'dashboard.user.loggingOut': 'Logging out...',
    'dashboard.user.logoutFailed': 'Logout failed. Please try again.',
    
    // Dashboard - Stats
    'dashboard.stats.profileViews': 'Profile Views',
    'dashboard.stats.applications': 'Applications',
    'dashboard.stats.interviews': 'Interviews',
    'dashboard.stats.profileComplete': 'Profile Complete',
    'dashboard.stats.activeJobs': 'Active Jobs',
    'dashboard.stats.totalApplications': 'Total Applications',
    'dashboard.stats.candidates': 'Candidates',
    'dashboard.stats.hires': 'Hires',
    
    // Dashboard - Job Recommendations
    'dashboard.jobs.recommendedJobs': 'Recommended Jobs',
    'dashboard.jobs.viewAll': 'View All',
    'dashboard.jobs.match': 'match',
    'dashboard.jobs.apply': 'Apply',
    'dashboard.jobs.fullTime': 'Full Time',
    'dashboard.jobs.partTime': 'Part Time',
    'dashboard.jobs.contract': 'Contract',
    'dashboard.jobs.remote': 'Remote',
    
    // Dashboard - Quick Actions
    'dashboard.actions.quickActions': 'Quick Actions',
    'dashboard.actions.browseJobs': 'Browse Jobs',
    'dashboard.actions.editProfile': 'Edit Profile',
    'dashboard.actions.viewApplications': 'View Applications',
    'dashboard.actions.updateResume': 'Update Resume',
    'dashboard.actions.postJob': 'Post Job',
    'dashboard.actions.manageCandidates': 'Manage Candidates',
    'dashboard.actions.viewAnalytics': 'View Analytics',
    'dashboard.actions.manageJobs': 'Manage Jobs',
    'dashboard.actions.changePassword': 'Change Password',
    
    // Dashboard - Recent Activity
    'dashboard.activity.recentApplications': 'Recent Applications',
    'dashboard.activity.recentCandidates': 'Recent Candidates',
    'dashboard.activity.appliedAt': 'Applied at',
    'dashboard.activity.pending': 'Pending',
    'dashboard.activity.reviewing': 'Reviewing',
    'dashboard.activity.interview': 'Interview',
    'dashboard.activity.rejected': 'Rejected',
    'dashboard.activity.accepted': 'Accepted',
    'dashboard.activity.hired': 'Hired',
    'dashboard.activity.new': 'New',
    'dashboard.activity.noApplications': 'No applications yet',
    'dashboard.activity.noCandidates': 'No candidates yet',
    
    // Dashboard - Employer Specific
    'dashboard.employer.welcomeBack': 'Welcome back, {name}!',
    'dashboard.employer.readyToHire': 'Ready to hire talent?',
    'dashboard.employer.jobPostings': 'Job Postings',
    'dashboard.employer.candidatePool': 'Candidate Pool',
    'dashboard.employer.hiringPipeline': 'Hiring Pipeline',
    'dashboard.employer.companyProfile': 'Company Profile',
    'dashboard.employer.active': 'Active',
    'dashboard.employer.paused': 'Paused',
    'dashboard.employer.closed': 'Closed',
    'dashboard.employer.viewDetails': 'View Details',
    'dashboard.employer.editJob': 'Edit',
    'dashboard.employer.viewCandidates': 'View Candidates',
    
    // Dashboard - Admin Specific
    'dashboard.admin.title': 'Admin Dashboard',
    'dashboard.admin.subtitle': 'System management and user administration',
    'dashboard.admin.totalUsers': 'Total Users',
    'dashboard.admin.totalJobs': 'Total Jobs',
    'dashboard.admin.newSignups': 'New Signups',
    'dashboard.admin.activeJobs': 'Active Jobs',
    'dashboard.admin.flaggedContent': 'Flagged Content',
    'dashboard.admin.systemHealth': 'System Health',
    'dashboard.admin.recentUsers': 'Recent Users',
    'dashboard.admin.viewAllUsers': 'View All Users',
    'dashboard.admin.user': 'User',
    'dashboard.admin.role': 'Role',
    'dashboard.admin.status': 'Status',
    'dashboard.admin.lastActive': 'Last Active',
    'dashboard.admin.actions': 'Actions',
    'dashboard.admin.view': 'View',
    'dashboard.admin.adminActions': 'Admin Actions',
    'dashboard.admin.createUser': 'Create User',
    'dashboard.admin.manageRoles': 'Manage Roles',
    'dashboard.admin.reviewJobs': 'Review Jobs',
    'dashboard.admin.viewAnalytics': 'View Analytics',
    'dashboard.admin.updateProfile': 'Update Profile',
    'dashboard.admin.changePassword': 'Change Password',
    'dashboard.admin.systemSettings': 'System Settings',
    'dashboard.admin.quickStats': 'Quick Stats',
    'dashboard.admin.storageUsage': 'Storage Usage',
    'dashboard.admin.apiUsage': 'API Usage',
    'dashboard.admin.databaseLoad': 'Database Load',
    'dashboard.admin.logout': 'Logout',
    'dashboard.admin.jobseeker': 'Job Seeker',
    'dashboard.admin.employer': 'Employer',
    'dashboard.admin.admin': 'Admin',
    'dashboard.admin.active': 'Active',
    'dashboard.admin.inactive': 'Inactive',
    'dashboard.admin.pending': 'Pending',
    'dashboard.admin.banned': 'Banned',
    
    // Job Listing
    'jobs.findDreamJob': 'Find Your Dream Job',
    'jobs.discoverOpportunities': 'Discover opportunities from top companies and take the next step in your career',
    'jobs.searchResults': 'Search Results',
    'jobs.allJobs': 'All Jobs',
    'jobs.jobsFound': 'jobs found',
    'jobs.keywords': 'Keywords',
    'jobs.location': 'Location',
    'jobs.type': 'Type',
    'jobs.minSalary': 'Min Salary',
    'jobs.maxSalary': 'Max Salary',
    'jobs.searchingJobs': 'Searching jobs...',
    'jobs.loadingJobs': 'Loading jobs...',
    'jobs.noJobsFound': 'No jobs found',
    'jobs.adjustSearchCriteria': 'Try adjusting your search criteria or browse all available jobs',
    'jobs.viewAllJobs': 'View All Jobs',
    'jobs.loadMoreJobs': 'Load More Jobs',
    
    // Job Card
    'jobs.company': 'Company',
    'jobs.expired': 'Expired',
    'jobs.today': 'Today',
    'jobs.yesterday': 'Yesterday',
    'jobs.tomorrow': 'Tomorrow',
    'jobs.daysAgo': '{days} days ago',
    'jobs.weeksAgo': '{weeks} weeks ago',
    'jobs.daysLeft': '{days} days left',
    'jobs.weeksLeft': '{weeks} weeks left',
    'jobs.requiredSkills': 'Required Skills:',
    'jobs.moreSkills': '+{count} more',
    
    // BeforeAuth - Email Check
    'beforeAuth.title': 'Get Started',
    'beforeAuth.subtitle': 'Enter your email to continue to your account',
    'beforeAuth.emailPlaceholder': 'Enter your email address',
    'beforeAuth.continue': 'Continue',
    'beforeAuth.or': 'Or',
    'beforeAuth.signInWith': 'Sign in with',
    'beforeAuth.signUpWith': 'Sign up with',
    'beforeAuth.google': 'Google',
    'beforeAuth.facebook': 'Facebook',
    'beforeAuth.redirectingLogin': 'Redirecting to login... 🔑',
    'beforeAuth.redirectingRegister': 'Redirecting to register... ✨',
    'beforeAuth.emailCheckFailed': 'Email check failed ❌',
    'beforeAuth.errorFixMessage': 'Please fix the following errors:',
    'beforeAuth.orContinueWith': 'or continue with',
    'beforeAuth.comingSoon': 'Coming Soon',
    'beforeAuth.backToHome': 'Back to Home',
    
    // Auth Forms
    'auth.back': 'Back',
  },
  ja: {
    // Header
    'header.findJobs': '求人検索',
    'header.companies': '企業',
    'header.careerAdvice': 'キャリア相談',
    'header.signIn': 'ログイン',
    'header.signUp': '新規登録',
    'header.dashboard': 'ダッシュボード',
    
    // Hero Section
    'hero.title': '理想の仕事を見つけよう',
    'hero.subtitle': 'トップ企業から数千の求人機会とつながろう',
    'hero.searchPlaceholder': '職種、スキル、または企業名',
    'hero.locationPlaceholder': '都市、県',
    'hero.searchButton': '🔍 求人検索',
    'hero.popularSearches': '人気の検索:',
    
    // Popular searches
    'search.softwareEngineer': 'ソフトウェアエンジニア',
    'search.marketingManager': 'マーケティングマネージャー',
    'search.dataAnalyst': 'データアナリスト',
    'search.productManager': 'プロダクトマネージャー',
    'search.uxDesigner': 'UXデザイナー',
    'search.salesRep': '営業担当',
    
    // Stats
    'stats.jobsDaily': '毎日の求人数',
    'stats.companies': '採用企業',
    'stats.candidates': '登録候補者',
    'stats.satisfaction': '満足度',
    
    // Featured Companies
    'companies.title': 'トップ企業が採用中',
    'companies.subtitle': '大手企業でのキャリア機会を発見',
    'companies.jobs': '求人',
    
    // Job Categories
    'categories.title': '業界別に探す',
    'categories.subtitle': '興味のある分野で機会を見つけよう',
    'categories.it': '情報技術',
    'categories.finance': '金融・銀行',
    'categories.healthcare': 'ヘルスケア・医薬品',
    'categories.education': '教育・研修',
    'categories.manufacturing': '製造業',
    'categories.retail': '小売・商業',
    'categories.marketing': 'マーケティング・広報',
    'categories.legal': '法務・法律',
    'categories.jobCount': '求人',
    
    // How it Works
    'howItWorks.title': 'たった3つの簡単なステップで求人を見つけよう',
    'howItWorks.subtitle': '迅速で効率的なプロセス',
    'howItWorks.step1.title': 'プロフィール作成',
    'howItWorks.step1.description': '経験とスキルの詳細情報でプロフェッショナルなプロフィールを構築',
    'howItWorks.step2.title': '検索・応募',
    'howItWorks.step2.description': '数千の求人機会を発見し、ワンクリックで応募',
    'howItWorks.step3.title': '採用決定',
    'howItWorks.step3.description': '雇用主と直接つながり、新しいキャリアをスタート',
    'howItWorks.getStarted': '🚀 今日から始めよう',
    
    // Footer
    'footer.description': 'ベトナム最大の人材プラットフォーム、才能と機会をつなぐ。',
    'footer.forCandidates': '求職者向け',
    'footer.findJobs': '求人検索',
    'footer.createCV': '履歴書作成',
    'footer.careerAdvice': 'キャリア相談',
    'footer.salary': '給与ガイド',
    'footer.forEmployers': '雇用主向け',
    'footer.postJobs': '求人掲載',
    'footer.findCandidates': '候補者検索',
    'footer.hrServices': 'HRサービス',
    'footer.marketReport': '市場レポート',
    'footer.aboutUs': 'Quickworkについて',
    'footer.about': '会社概要',
    'footer.contact': '連絡先',
    'footer.terms': '利用規約',
    'footer.privacy': 'プライバシー',
    'footer.copyright': '全ての権利が保護されています。',
    'footer.madeWith': 'Made with ❤️ in Vietnam',
    
    // Authentication - Login
    'auth.login.title': 'おかえりなさい',
    'auth.login.subtitle': 'アカウントにサインインしてください',
    'auth.login.email': 'メールアドレス',
    'auth.login.password': 'パスワード',
    'auth.login.emailPlaceholder': 'メールアドレスを入力',
    'auth.login.passwordPlaceholder': 'パスワードを入力',
    'auth.login.button': 'サインイン',
    'auth.login.forgotPassword': 'パスワードを忘れましたか？',
    'auth.login.noAccount': 'アカウントをお持ちでない方',
    'auth.login.signUp': '新規登録',
    'auth.login.success': 'ログイン成功 ✨',
    'auth.login.error': 'ログイン失敗 ❌',
    'auth.login.errorFixMessage': '以下のエラーを修正してください：',
    
    // Authentication - Register
    'auth.register.title': '新規アカウント作成',
    'auth.register.subtitle': 'キャリアの旅を始めましょう',
    'auth.register.email': 'メールアドレス',
    'auth.register.password': 'パスワード',
    'auth.register.confirmPassword': 'パスワード確認',
    'auth.register.emailPlaceholder': 'メールアドレスを入力',
    'auth.register.passwordPlaceholder': '強力なパスワードを作成',
    'auth.register.confirmPasswordPlaceholder': 'パスワードを確認',
    'auth.register.button': 'アカウント作成',
    'auth.register.haveAccount': 'すでにアカウントをお持ちですか？',
    'auth.register.signIn': 'サインイン',
    'auth.register.success': '登録成功 ✨',
    'auth.register.error': '登録失敗 ❌',
    'auth.register.errorFixMessage': '以下のエラーを修正してください：',
    
    // Common validation messages
    'validation.required': 'この項目は必須です',
    'validation.email.invalid': '無効なメールアドレス',
    'validation.email.required': 'メールアドレスは必須です',
    'validation.password.required': 'パスワードは必須です',
    'validation.password.min': 'パスワードは6文字以上',
    'validation.password.confirm': 'パスワードが一致しません',
    'validation.password.strength.weak': '弱い',
    'validation.password.strength.fair': '普通',
    'validation.password.strength.good': '良い',
    'validation.password.strength.strong': '強い',
    'validation.email.exists': 'メールアドレスが既に存在します',
    'validation.email.available': 'メールアドレスは利用可能です',
    'validation.email.checking': '確認中...',
    
    // Dashboard - User
    'dashboard.user.welcomeBack': 'おかえりなさい、{name}さん！',
    'dashboard.user.readyToFind': '次の機会を見つける準備はできていますか？',
    'dashboard.user.jobSeekerProfile': '求職者プロフィール',
    'dashboard.user.employerProfile': '雇用主プロフィール',
    'dashboard.user.adminProfile': '管理者プロフィール',
    'dashboard.user.userProfile': 'ユーザープロフィール',
    'dashboard.user.loadingProfile': 'プロフィールを読み込み中...',
    'dashboard.user.logout': 'ログアウト',
    'dashboard.user.editProfile': 'プロフィールを編集',
    'dashboard.user.loggingOut': 'ログアウト中...',
    'dashboard.user.logoutFailed': 'ログアウトに失敗しました。もう一度お試しください。',
    
    // Dashboard - Stats
    'dashboard.stats.profileViews': 'プロフィール閲覧数',
    'dashboard.stats.applications': '応募数',
    'dashboard.stats.interviews': '面接数',
    'dashboard.stats.profileComplete': 'プロフィール完成度',
    'dashboard.stats.activeJobs': 'アクティブな求人',
    'dashboard.stats.totalApplications': '総応募数',
    'dashboard.stats.candidates': '候補者数',
    'dashboard.stats.hires': '採用数',
    
    // Dashboard - Job Recommendations
    'dashboard.jobs.recommendedJobs': 'おすすめの求人',
    'dashboard.jobs.viewAll': 'すべて表示',
    'dashboard.jobs.match': 'マッチ',
    'dashboard.jobs.apply': '応募する',
    'dashboard.jobs.fullTime': 'フルタイム',
    'dashboard.jobs.partTime': 'パートタイム',
    'dashboard.jobs.contract': '契約',
    'dashboard.jobs.remote': 'リモート',
    
    // Dashboard - Quick Actions
    'dashboard.actions.quickActions': 'クイックアクション',
    'dashboard.actions.browseJobs': '求人を閲覧',
    'dashboard.actions.editProfile': 'プロフィール編集',
    'dashboard.actions.viewApplications': '応募を確認',
    'dashboard.actions.updateResume': '履歴書を更新',
    'dashboard.actions.postJob': '求人を投稿',
    'dashboard.actions.manageCandidates': '候補者を管理',
    'dashboard.actions.viewAnalytics': '分析を表示',
    'dashboard.actions.manageJobs': '求人を管理',
    'dashboard.actions.changePassword': 'パスワードを変更',
    
    // Dashboard - Recent Activity
    'dashboard.activity.recentApplications': '最近の応募',
    'dashboard.activity.recentCandidates': '最近の候補者',
    'dashboard.activity.appliedAt': '応募日',
    'dashboard.activity.pending': '保留中',
    'dashboard.activity.reviewing': '審査中',
    'dashboard.activity.interview': '面接',
    'dashboard.activity.rejected': '不採用',
    'dashboard.activity.accepted': '承認',
    'dashboard.activity.hired': '採用済み',
    'dashboard.activity.new': '新規',
    'dashboard.activity.noApplications': 'まだ応募がありません',
    'dashboard.activity.noCandidates': 'まだ候補者がいません',
    
    // Dashboard - Employer Specific
    'dashboard.employer.welcomeBack': 'おかえりなさい、{name}さん！',
    'dashboard.employer.readyToHire': '人材を採用する準備はできていますか？',
    'dashboard.employer.jobPostings': '求人投稿',
    'dashboard.employer.candidatePool': '候補者プール',
    'dashboard.employer.hiringPipeline': '採用パイプライン',
    'dashboard.employer.companyProfile': '会社プロフィール',
    'dashboard.employer.active': 'アクティブ',
    'dashboard.employer.paused': '一時停止',
    'dashboard.employer.closed': '終了',
    'dashboard.employer.viewDetails': '詳細を表示',
    'dashboard.employer.editJob': '編集',
    'dashboard.employer.viewCandidates': '候補者を表示',
    
    // Dashboard - Admin Specific
    'dashboard.admin.title': '管理者ダッシュボード',
    'dashboard.admin.subtitle': 'システム管理とユーザー管理',
    'dashboard.admin.totalUsers': '総ユーザー数',
    'dashboard.admin.totalJobs': '総求人数',
    'dashboard.admin.newSignups': '新規登録',
    'dashboard.admin.activeJobs': 'アクティブな求人',
    'dashboard.admin.flaggedContent': 'フラグ付きコンテンツ',
    'dashboard.admin.systemHealth': 'システムヘルス',
    'dashboard.admin.recentUsers': '最近のユーザー',
    'dashboard.admin.viewAllUsers': 'すべてのユーザーを表示',
    'dashboard.admin.user': 'ユーザー',
    'dashboard.admin.role': '役割',
    'dashboard.admin.status': 'ステータス',
    'dashboard.admin.lastActive': '最終アクティブ',
    'dashboard.admin.actions': 'アクション',
    'dashboard.admin.view': '表示',
    'dashboard.admin.adminActions': '管理者アクション',
    'dashboard.admin.createUser': 'ユーザー作成',
    'dashboard.admin.manageRoles': '役割管理',
    'dashboard.admin.reviewJobs': '求人レビュー',
    'dashboard.admin.viewAnalytics': '分析を表示',
    'dashboard.admin.updateProfile': 'プロフィール更新',
    'dashboard.admin.changePassword': 'パスワード変更',
    'dashboard.admin.systemSettings': 'システム設定',
    'dashboard.admin.quickStats': 'クイック統計',
    'dashboard.admin.storageUsage': 'ストレージ使用量',
    'dashboard.admin.apiUsage': 'API使用量',
    'dashboard.admin.databaseLoad': 'データベース負荷',
    'dashboard.admin.logout': 'ログアウト',
    'dashboard.admin.jobseeker': '求職者',
    'dashboard.admin.employer': '雇用主',
    'dashboard.admin.admin': '管理者',
    'dashboard.admin.active': 'アクティブ',
    'dashboard.admin.inactive': '非アクティブ',
    'dashboard.admin.pending': '保留中',
    'dashboard.admin.banned': '禁止',
    
    // Job Listing
    'jobs.findDreamJob': '理想の仕事を見つけよう',
    'jobs.discoverOpportunities': 'トップ企業から機会を発見し、キャリアの次のステップを踏み出そう',
    'jobs.searchResults': '検索結果',
    'jobs.allJobs': '全ての求人',
    'jobs.jobsFound': '件の求人が見つかりました',
    'jobs.keywords': 'キーワード',
    'jobs.location': '場所',
    'jobs.type': '種類',
    'jobs.minSalary': '最低給与',
    'jobs.maxSalary': '最高給与',
    'jobs.searchingJobs': '求人を検索中...',
    'jobs.loadingJobs': '求人を読み込み中...',
    'jobs.noJobsFound': '求人が見つかりませんでした',
    'jobs.adjustSearchCriteria': '検索条件を調整するか、利用可能な全ての求人を閲覧してください',
    'jobs.viewAllJobs': '全ての求人を表示',
    'jobs.loadMoreJobs': 'さらに求人を読み込む',
    
    // Job Card
    'jobs.company': '会社',
    'jobs.expired': '期限切れ',
    'jobs.today': '今日',
    'jobs.yesterday': '昨日',
    'jobs.tomorrow': '明日',
    'jobs.daysAgo': '{days}日前',
    'jobs.weeksAgo': '{weeks}週間前',
    'jobs.daysLeft': '残り{days}日',
    'jobs.weeksLeft': '残り{weeks}週間',
    'jobs.requiredSkills': '必要スキル:',
    'jobs.moreSkills': '+{count}個のスキル',
    
    // BeforeAuth - Email Check
    'beforeAuth.title': '始める',
    'beforeAuth.subtitle': 'アカウントに続行するためにメールアドレスを入力してください',
    'beforeAuth.emailPlaceholder': 'メールアドレスを入力',
    'beforeAuth.continue': '続行',
    'beforeAuth.or': 'または',
    'beforeAuth.signInWith': 'ログイン',
    'beforeAuth.signUpWith': 'サインアップ',
    'beforeAuth.google': 'Google',
    'beforeAuth.facebook': 'Facebook',
    'beforeAuth.redirectingLogin': 'ログインにリダイレクト中... 🔑',
    'beforeAuth.redirectingRegister': '登録にリダイレクト中... ✨',
    'beforeAuth.emailCheckFailed': 'メールチェックに失敗しました ❌',
    'beforeAuth.errorFixMessage': '以下のエラーを修正してください：',
    'beforeAuth.orContinueWith': 'または以下で続行',
    'beforeAuth.comingSoon': '近日公開',
    'beforeAuth.backToHome': 'ホームに戻る',
    
    // Auth Forms
    'auth.back': '戻る',
  }
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('quickwork-language');
    return (saved as Language) || 'vi';
  });

  useEffect(() => {
    localStorage.setItem('quickwork-language', language);
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = (translations[language] as any)[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{${paramKey}}`, paramValue.toString());
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
