import { defineStore } from 'pinia'

export const useRecuitFormStore = defineStore('RecuitFormState', () => {
  let isUpdateProfileInfo = ref(false); // Update user Data tirgger 
  const currentStep = ref(1)
  const totalSteps = ref(5)
  const steps = [
    {
      id: 1,
      title: "ব্যক্তিগত তথ্য",
      description: "Personal Information",
      icon: "User",
      name: 'user_profile'
    },
    {
      id: 2,
      title: "শিক্ষাগত যোগ্যতা",
      description: "Academic Qualificaitons",
      icon: "Education",
      name: 'academic_qualifications_exists'
    },
    {
      id: 3,
      title: "অভিজ্ঞতা",
      description: "Work experiences",
      icon: "work",
      name: 'work_experience_exists'
    },
    {
      id: 4,
      title: "গবেষণা ও প্রকাশনা",
      description: "Research & Publications",
      icon: "book",
      name: 'user_research_publication_exists'
    },
    // {
      //   id: 5,
      //   title: "সংযুক্তি",
      //   description: "Attachments",
      //   icon: "attachmentPin"
    // },
    {
      id: 5,
      title: "প্রশিক্ষণ/সার্টিফিকেট কোর্স",
      description: "Training/Certificate course",
      icon: "attachmentPin",
      name: 'user_trainings_exists'
    },
  ];

  // Check List for step is complete or not 
  let checkList = ref({});

  // Stage-2 Data
  const inputs = ref([
    [
      { id: 1, placeholder: 'Dhaka/এসো কুরআন শিখি', title: "Board/Institute", name: 'institution' },
      { id: 2, placeholder: 'SSC/B.Sc.', title: "Degree/Exam Name", name: 'degree' },
      { id: 3, placeholder: 'Science/CSE', title: "Field of Study/Subject", name: 'field_of_study' },
      { id: 4, placeholder: '2000', title: "Start Year", name: 'start_date' },
      { id: 5, placeholder: '', title: "End Year", name: 'end_date' },
      { id: 6, placeholder: '2005', title: "Certificate Year", name: 'certificate_year' },
      { id: 7, placeholder: '3.56', title: "GPA/CGPA", name: 'grade' },
      { id: 8, placeholder: '4.00', title: "GPA/CGPA Out of", name: 'grade_out_of' },
      { id: 9, placeholder: '', title: "Division/Class", name: 'division' },
      { id: 10, placeholder: '', title: "Result", name: 'result' },
      { id: 11, placeholder: '', title: "Certificate Scan", name: 'certificate_scan' },
      { id: 12, placeholder: '', title: "Transcript Scan", name: 'transcript_scan' },
      { id: 13, placeholder: 'Action', title: "Action", name: 'sort_order' },
    ],
  ]);

  const inputValues = ref([
    {
      'institution': '',
      'degree': '',
      'field_of_study': '',
      'start_date': '',
      'end_date': '',
      'certificate_year': '',
      'grade': '',
      'grade_out_of': '',
      'certificate_scan': {},
      'transcript_scan': {},
      'division': '',
      'result': '',
      'sort_order': ''
    }
  ]);

  const userInfoStage2 = ref({});

  let isEndDate = ref([[false]]);
  let isDivisionDisable = ref([[false]]);


  // Stage-3 Data
  const inputsStage3 = ref([
    [
      {
        id: 1,
        placeholder: "Company/Institution",
        title: "Company/Institution Name",
        name: "company_name",
      },
      {
        id: 2,
        placeholder: "Position/Designation",
        title: "Position/Designation",
        name: "position",
      },
      { id: 3, placeholder: "2000", title: "Start Date", name: "start_date" },
      { id: 4, placeholder: "", title: "End Date", name: "end_date" },
      { id: 5, placeholder: "2004", title: "NOC Certificate", name: "noc_scan" },
      { id: 6, placeholder: "2004", title: "Experience Certificate", name: "experience_scan" },
      {
        id: 7,
        placeholder: "Dhaka/এসো কুরআন শিখি",
        title: "Job Description",
        name: "description",
      },
      { id: 8, placeholder: "", title: "Action", name: "sort_order" },
    ],
  ]);

  const inputValuesStage3 = ref([
    {
      company_name: "",
      position: "",
      start_date: "",
      noc_scan: "",
      experience_scan: "",
      end_date: "",
      description: "",
      sort_order: "",
    },
  ]);

  const userInfoStage3 = ref({});

  let isEndDateSatge3 = ref([[false]]);

  // Language Data
  const userLanguageInfo = ref([]);

  const languageInputs = ref([
    [
      { id: 1, placeholder: 'Languages', title: "ভাষার নাম", name: 'language_id' },
      { id: 2, placeholder: 'Skills', title: "দক্ষতা", name: 'language_proficiency_id' },
      { id: 3, placeholder: 'Action', title: "Action", name: 'sort_order' },
    ],
  ]);

  const langaugeValues = ref([
    {
      language_id: "",
      language_proficiency_id: "",
      sort_order: ""
    },
  ]);


  // Stage-4 Data
  const inputsStage4 = ref([
    [
      {
        id: 1,
        placeholder: "Author/Authors Name",
        title: "Author/Authors Name",
        name: "author_name",
      },
      {
        id: 2,
        placeholder: "",
        title: "Title",
        name: "title",
      },
      { id: 3, placeholder: "", title: "Name of Journal", name: "journal_name" },
      {
        id: 4,
        placeholder: "120",
        title: "Page",
        name: "page",
      },
      { id: 5, placeholder: "2004", title: "Year", name: "year" },
      { id: 6, placeholder: "4", title: "Vol.", name: "vol" },
      { id: 7, placeholder: "", title: "Description", name: "description" },
      { id: 8, placeholder: "", title: "Link (If Available)", name: "link" },
      { id: 9, placeholder: "", title: "Action", name: "sort_order" },
    ],
  ]);

  const inputValuesStage4 = ref([
    {
      author_name: "",
      title: "",
      journal_name: "",
      vol: "",
      page: "",
      year: "",
      link: "",
      description: "",
      sort_order: "",
    },
  ]);

  const userInfoStage4 = ref({});


  // Stage-5 Data
  const inputsStage5 = ref([
    [
      {
        id: 1,
        placeholder: "Training Name",
        title: "Training Name",
        name: "training_name",
      },
      {
        id: 2,
        placeholder: "Trainer Organization",
        title: "Trainer Organization",
        name: "trainer_organization",
      },
      {
        id: 3,
        placeholder: "Training Length",
        title: "Training Length",
        name: "training_length",
      },
      {
        id: 4,
        placeholder: "Training Certificate",
        title: "Training Certificate",
        name: "training_certificate",
      },
      {
        id: 5,
        placeholder: "Training Description",
        title: "Training Description",
        name: "training_description",
      },
      { id: 6, placeholder: "", title: "Action", name: "sort_order" },
    ],
  ]);

  const inputValuesStage5 = ref([
    {
      training_name: "",
      trainer_organization: "",
      training_length: "",
      training_description: "",
      training_certificate: "",
      sort_order: "",
    },
  ]);

  const userInfoStage5 = ref({});


  return { currentStep, totalSteps, steps, checkList, inputs, inputValues, userInfoStage2, isEndDate, isDivisionDisable, inputsStage3, inputValuesStage3, userInfoStage3, isEndDateSatge3, inputsStage4, inputValuesStage4, userInfoStage4, inputsStage5, inputValuesStage5, userInfoStage5, userLanguageInfo, languageInputs, langaugeValues, isUpdateProfileInfo }
})
