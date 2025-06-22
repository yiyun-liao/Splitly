<p>
  <img
    src="my-next-app/public/logo/splitly.svg"
    width="160"
    alt="Splitly Logo"
    style="vertical-align: middle; margin-right: 8px;"
  />
</p>

### https://splitly-steel.vercel.app/
> Helping you and your friends/colleagues quickly split bills and track expenses, supporting multiple splitting methods

## Tech
### Tech stack
<p align="center">
  <img 
    src="readme-img/tech-stack.png" 
    width="600" 
    alt="tech-stack" 
  />
</p>

### Structure
<p align="center">
  <img 
    src="readme-img/page-flow.jpg" 
    width="600" 
    alt="page-structure" 
  />
</p>

### Technical Topics
- React
    - React Hooks: `useState`, `useEffect`, `useRef`, `useRouter`
    - Custom Hooks (Global)
        - Handling data display requirements: `usePaymentStats`
        - Handling UI: `useIsMobile`, `useScrollDirection`, `useCarousel`
        - Caching last visited project: `useTrackLastVisitedProjectPath`
        - Managing settlements: `useSettleDebts`
    - Custom Hooks (Specific)
        - User updates: `useUpdateUser`
        - Payment CRUD: `useCreatePayment`, `useDeletePayment`, `useUpdatePayment`
        - Project CRUD: `useAddMemberProject`, `useCreateProject`, `useUpdateProject`
        - Real-time calculation of three split categories on payment creation:
`useSplitActualMap`, `useSplitAdjustMap`, `useSplitPercentageMap`
    - React Context: 
        - `AuthContext`: authentication and user profile data
        - `CategoryContext`: income/expense category data (preloaded before login)
        - `GlobalProjectContext`: transitioning from user data to project data, organizing requirements and preloading images
        - `CurrentProjectContext`: current project details and member data
        - `LoadingContext`: managing loading states
  - Use the same data schema for individuals, groups, repayments, and splits
  - Derive the splitting method from repayment values **<u>percentage, actual, update</u>** while maintaining schema flexibility
- Income & Expense Display
  - Leverage the data design to fetch and compute the fields required for each display scenario
- Third-Party Login
- Front-end/Back-end Separation (MVC)
- Cache data and ensure correctness, only calling the API when the user manually refreshes the browser
- Responsive Web Design

<p align="center">
  <img 
    src="readme-img/db-design.jpg" 
    width="600" 
    alt="db-design" 
  />
  <img 
    src="readme-img/db-design-2.jpg" 
    width="600" 
    alt="db-design" 
  />
    <img 
    src="readme-img/db-design-3.jpg" 
    width="600" 
    alt="db-design" 
  />
    <img 
    src="readme-img/device-all.gif" 
    width="600" 
    alt="rwd" 
  />
</p>

## Website DEMO

### Project Create & Join
- Create a project
- Send a join link to members; they use the link to join the project
<p align="center">
  <img 
    src="readme-img/video_create_and_join.gif" 
    width="600" 
    alt="create_and_join" 
  />
</p>

### Payment Create & Update
- Split by individual: percentage, actual, update
- Split by item: In each item, user still can choose the splitting method: percentage, actual, update
<p align="center">
  <img 
    src="readme-img/video_create_group_expense.gif" 
    width="600" 
    alt="create_group_expense" 
  />
  <img 
    src="readme-img/video_split_by_item.gif" 
    width="600" 
    alt="split_by_item" 
  />
    <img 
    src="readme-img/video_create_transfer.gif" 
    width="600" 
    alt="create_transfer" 
  />
</p>

### Personal Expenses
Personal expenses will only be displayed in the user's own account and will be included in their total expenses. Team members will not be able to see them."
<p align="center">
  <img 
    src="readme-img/video_create_personal_expense.gif" 
    width="600" 
    alt="create_personal_expense" 
  />
</p>

### Read & Settle Payments
- View by category and income detail
<p align="center">
  <img 
    src="readme-img/video_read.gif" 
    width="600" 
    alt="read" 
  />
</p>

### Settle Payments
- Two debt views: individual actual debt and simplified settlement
<p align="center">
  <img 
    src="readme-img/video_settle.gif" 
    width="600" 
    alt="video_settle" 
  />
</p>

## View More
- [read more in presentation](https://www.figma.com/proto/SK132yqquO5w5M3UPLGu1N/wehelp?page-id=0%3A1&node-id=82-2&viewport=-3647%2C169%2C0.21&t=kEbRTEOd8nIkbLum-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=82%3A2&show-proto-sidebar=1)
