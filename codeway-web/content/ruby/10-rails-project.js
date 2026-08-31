'use strict';

module.exports = {
  slug: '10-rails-project',
  title: 'مقدمة Ruby on Rails ومشروع متكامل',
  summary: 'فلسفة Rails ونمط MVC، الهجرات و Active Record والتوجيه والعروض، ثم بناء مدوّنة كاملة خطوة بخطوة.',
  duration: 90,
  level: 'احترافي',
  tags: ['Rails', 'MVC', 'ActiveRecord', 'مشروع'],
  objectives: [
    'تفهم مبدأي «الاتفاق قبل الإعداد» و«لا تكرّر نفسك».',
    'تنشئ تطبيق Rails وتفهم بنية مجلّداته.',
    'تعرّف نماذج وهجرات وعلاقات بـ Active Record.',
    'تكتب توجيهاً RESTful ومتحكّمات وعروضاً بـ ERB.',
    'تضيف تحقّقاً ومصادقة وصلاحيات.',
    'تبني مدوّنة كاملة من الصفر حتى النشر.'
  ],
  quickRef: [
    { code: 'rails new app', desc: 'مشروع جديد' },
    { code: 'rails g model X', desc: 'توليد نموذج' },
    { code: 'rails db:migrate', desc: 'تطبيق الهجرات' },
    { code: 'rails s', desc: 'تشغيل الخادم' },
    { code: 'rails c', desc: 'صدفة تفاعلية' },
    { code: 'rails routes', desc: 'عرض المسارات' },
    { code: 'has_many :posts', desc: 'علاقة' },
    { code: 'before_action', desc: 'مرشّح' }
  ],
  blocks: [
    { t: 'h2', text: 'فلسفة Rails' },
    { t: 'features', items: [
      { icon: 'zap', title: 'الاتفاق قبل الإعداد', text: 'لو سمّيت الأشياء بالطريقة المتوقّعة، يعمل كل شيء بلا إعداد. جدول `posts` ← نموذج `Post`.' },
      { icon: 'refresh', title: 'لا تكرّر نفسك', text: 'كل معلومة تُعرَّف في مكان واحد فقط. بنية الجدول في الهجرة، والنموذج يقرأها تلقائياً.' },
      { icon: 'box', title: 'شامل بالبطاريات', text: 'ORM وتوجيه وقوالب ومصادقة وبريد ومهام خلفية — كلها جاهزة ومتناسقة.' },
      { icon: 'users', title: 'سعادة المطوّر', text: 'نفس فلسفة Ruby: الشيفرة الجميلة المقروءة أهمّ من الشيفرة الذكية.' }
    ]},
    { t: 'note', text: '«الاتفاق قبل الإعداد» يعني أن Rails يفترض افتراضات ذكية بدل إجبارك على ملفات إعداد. المقابل: عليك تعلّم هذه الاتفاقات — لكنك تتعلّمها مرة وتستفيد منها في كل مشروع.' },

    { t: 'h2', text: 'MVC' },
    { t: 'demo', title: 'دورة حياة الطلب في Rails', height: 380,
      css: 'body{font-family:system-ui;margin:0;padding:14px;background:#fff}.flow{display:flex;flex-direction:column;gap:8px}.step{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;border:1px solid #e2e8f0;background:#f8fafc}.n{width:26px;height:26px;border-radius:50%;background:#701516;color:#fff;display:grid;place-items:center;font-weight:700;font-size:.8em;flex-shrink:0}.t{font-weight:700;font-size:.88em;margin-bottom:2px}.d{font-size:.78em;color:#64748b}.arr{text-align:center;color:#cbd5e1;font-size:.9em;line-height:1}',
      html: '<div class="flow"><div class="step"><div class="n">1</div><div><div class="t">المتصفّح</div><div class="d">GET /posts/5</div></div></div><div class="arr">▼</div><div class="step"><div class="n">2</div><div><div class="t">الموجّه — config/routes.rb</div><div class="d">يطابق المسار ويحدّد المتحكّم والإجراء: posts#show</div></div></div><div class="arr">▼</div><div class="step"><div class="n">3</div><div><div class="t">المتحكّم — PostsController#show</div><div class="d">ينسّق العملية ويجهّز البيانات</div></div></div><div class="arr">▼</div><div class="step"><div class="n">4</div><div><div class="t">النموذج — Post.find(5)</div><div class="d">يستعلم من قاعدة البيانات ويطبّق منطق العمل</div></div></div><div class="arr">▼</div><div class="step"><div class="n">5</div><div><div class="t">العرض — show.html.erb</div><div class="d">يبني HTML من البيانات</div></div></div><div class="arr">▼</div><div class="step"><div class="n">6</div><div><div class="t">الاستجابة</div><div class="d">HTML يعود للمتصفّح</div></div></div></div>' },

    { t: 'h2', text: 'إنشاء المشروع' },
    { t: 'code', lang: 'bash', code: `
gem install rails
rails new blog --database=postgresql --css=tailwind
cd blog
bin/rails db:create
bin/rails server            # http://localhost:3000
`.trim() },
    { t: 'code', lang: 'text', code: `
blog/
├── app/
│   ├── controllers/     ← المتحكّمات
│   ├── models/          ← النماذج ومنطق العمل
│   ├── views/           ← القوالب
│   ├── helpers/         ← دوال مساعدة للعروض
│   ├── javascript/
│   ├── jobs/            ← المهام الخلفية
│   └── mailers/         ← البريد
├── config/
│   ├── routes.rb        ← تعريف المسارات
│   ├── database.yml
│   └── environments/
├── db/
│   ├── migrate/         ← الهجرات
│   ├── schema.rb        ← البنية الحالية (مُولَّد)
│   └── seeds.rb         ← بيانات أولية
├── spec/ أو test/
├── Gemfile
└── bin/
`.trim() },

    { t: 'h2', text: 'النماذج والهجرات' },
    { t: 'code', lang: 'bash', code: `
bin/rails generate model Post title:string body:text published:boolean
bin/rails db:migrate
`.trim() },
    { t: 'code', lang: 'ruby', code: `
# db/migrate/20260827120000_create_posts.rb
class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.string  :title, null: false
      t.text    :body
      t.boolean :published, default: false, null: false
      t.references :user, null: false, foreign_key: true
      t.datetime :published_at

      t.timestamps          # created_at و updated_at
    end

    add_index :posts, :published
    add_index :posts, [:user_id, :created_at]
  end
end
`.trim() },
    { t: 'code', lang: 'bash', code: `
bin/rails db:migrate             # طبّق الهجرات الجديدة
bin/rails db:rollback            # تراجع عن آخر هجرة
bin/rails db:migrate:status      # ما المُطبَّق وما لا؟
bin/rails db:seed                # شغّل seeds.rb
bin/rails db:prepare             # ينشئ ويهاجر ويزرع
`.trim() },
    { t: 'danger', title: 'لا تعدّل هجرة طُبِّقت على الإنتاج', text: 'اكتب هجرة جديدة بدلاً من ذلك. تعديل هجرة قديمة يجعل قاعدة بيانات فريقك وقاعدة الإنتاج مختلفتين عن الشيفرة، وهذا مصدر كوارث صامتة.' },

    { t: 'h2', text: 'Active Record — العلاقات' },
    { t: 'code', lang: 'ruby', code: `
class User < ApplicationRecord
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :commented_posts, through: :comments, source: :post
  has_one  :profile, dependent: :destroy

  validates :email, presence: true, uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { in: 2..60 }
end

class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings
  has_one_attached :cover_image

  validates :title, presence: true, length: { in: 5..120 }
  validates :body,  presence: true, length: { minimum: 20 }

  scope :published, -> { where(published: true) }
  scope :recent,    -> { order(created_at: :desc) }
  scope :by_author, ->(user) { where(user:) }
  scope :search,    ->(q) { where("title ILIKE ?", "%#{q}%") if q.present? }

  before_save :set_published_at

  def excerpt(length = 160) = body.truncate(length)
  def reading_minutes = (body.split.size / 200.0).ceil

  private

  def set_published_at
    self.published_at ||= Time.current if published?
  end
end
`.trim() },
    { t: 'h3', text: 'الاستعلامات' },
    { t: 'code', lang: 'ruby', code: `
Post.all
Post.find(5)                       # يرمي RecordNotFound
Post.find_by(title: "مرحبا")       # يُرجع nil
Post.where(published: true)
Post.where("created_at > ?", 1.week.ago)
Post.where(user: current_user).count

Post.published.recent.limit(10)    # النطاقات تتسلسل
Post.published.includes(:user, :comments)   # يمنع مشكلة N+1
Post.joins(:comments).group(:id).having("COUNT(comments.id) > 5")
Post.order(created_at: :desc).page(params[:page])

post = Post.new(title: "عنوان", body: "محتوى")
post.save             # => true/false
post.save!            # يرمي عند الفشل
post.update(title: "جديد")
post.destroy

Post.create!(title: "عنوان", body: "محتوى", user: current_user)
`.trim() },
    { t: 'danger', title: 'مشكلة N+1 — أشهر مشكلة أداء في Rails', text: 'عرض 50 مقالاً واسم كاتب كل منها بلا `includes` ينفّذ **51 استعلاماً** بدل استعلامين. أضف `includes(:user)` دائماً حين تعرض بيانات علاقة في حلقة، واستخدم gem مثل `bullet` ليحذّرك تلقائياً.' },
    { t: 'compare', lang: 'ruby', bad: {
      code: `# المتحكّم
@posts = Post.published.recent.limit(50)

# العرض
<% @posts.each do |post| %>
  <p><%= post.user.name %></p>   <%# استعلام لكل مقال! %>
<% end %>`,
      why: '51 استعلاماً: واحد للمقالات وواحد لكل كاتب. على 500 مقال يصبح الأمر كارثياً.'
    }, good: {
      code: `# المتحكّم
@posts = Post.published.recent.includes(:user).limit(50)

# العرض — بلا تغيير
<% @posts.each do |post| %>
  <p><%= post.user.name %></p>
<% end %>`,
      why: 'استعلامان فقط مهما كان عدد المقالات: واحد للمقالات وواحد لكل الكتّاب دفعة واحدة.'
    }},

    { t: 'h2', text: 'التوجيه' },
    { t: 'code', lang: 'ruby', code: `
# config/routes.rb
Rails.application.routes.draw do
  root "posts#index"

  resources :posts do
    resources :comments, only: %i[create destroy]
    member     { patch :publish }      # /posts/5/publish
    collection { get   :drafts }       # /posts/drafts
  end

  resource  :session, only: %i[new create destroy]
  resources :users, only: %i[new create show]

  namespace :admin do
    resources :posts
    root "dashboard#index"
  end

  get  "/about", to: "pages#about"
  get  "/@:username", to: "users#show", as: :profile

  match "/404", to: "errors#not_found", via: :all
end
`.trim() },
    { t: 'p', text: '`resources :posts` يولّد سبعة مسارات RESTful:' },
    { t: 'table', head: ['الفعل', 'المسار', 'الإجراء', 'الغرض'], rows: [
      ['GET', '/posts', '`index`', 'قائمة'],
      ['GET', '/posts/new', '`new`', 'نموذج إنشاء'],
      ['POST', '/posts', '`create`', 'حفظ الجديد'],
      ['GET', '/posts/:id', '`show`', 'عرض واحد'],
      ['GET', '/posts/:id/edit', '`edit`', 'نموذج تعديل'],
      ['PATCH', '/posts/:id', '`update`', 'حفظ التعديل'],
      ['DELETE', '/posts/:id', '`destroy`', 'حذف']
    ]},
    { t: 'tip', text: 'اكتب `bin/rails routes | grep post` لرؤية كل مسارات المقالات مع أسماء الدوال المساعدة (`posts_path`, `edit_post_path(post)`).' },

    { t: 'h2', text: 'المتحكّمات' },
    { t: 'code', lang: 'ruby', code: `
class PostsController < ApplicationController
  before_action :require_login, except: %i[index show]
  before_action :set_post, only: %i[show edit update destroy publish]
  before_action :authorize_owner!, only: %i[edit update destroy publish]

  def index
    @posts = Post.published
                 .includes(:user, :tags)
                 .search(params[:q])
                 .recent
                 .page(params[:page])
  end

  def show
    @comments = @post.comments.includes(:user).recent
    @comment  = Comment.new
  end

  def new
    @post = current_user.posts.build
  end

  def create
    @post = current_user.posts.build(post_params)

    if @post.save
      redirect_to @post, notice: "نُشِر المقال بنجاح."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @post.update(post_params)
      redirect_to @post, notice: "حُدِّث المقال."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @post.destroy
    redirect_to posts_path, notice: "حُذِف المقال.", status: :see_other
  end

  def publish
    @post.update!(published: true, published_at: Time.current)
    redirect_to @post, notice: "أصبح المقال منشوراً."
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def authorize_owner!
    redirect_to posts_path, alert: "غير مصرّح." unless @post.user == current_user
  end

  # المعاملات القوية — تمنع الإسناد الجماعي الخطير
  def post_params
    params.require(:post).permit(:title, :body, :published, :cover_image, tag_ids: [])
  end
end
`.trim() },
    { t: 'danger', title: 'المعاملات القوية ليست اختيارية', text: 'بدون `permit` يستطيع مهاجم إرسال `post[user_id]=1` أو `post[admin]=true` في النموذج فيغيّر حقولاً لم تقصد السماح بها. اسمح صراحةً بما تحتاجه فقط.' },

    { t: 'h2', text: 'العروض' },
    { t: 'code', lang: 'html', code: `
<%# app/views/posts/index.html.erb %>
<h1>المقالات</h1>

<%= form_with url: posts_path, method: :get, class: "search" do |f| %>
  <%= f.search_field :q, value: params[:q], placeholder: "ابحث…" %>
  <%= f.submit "بحث" %>
<% end %>

<% if @posts.any? %>
  <div class="grid">
    <%= render partial: "post_card", collection: @posts, as: :post %>
  </div>
  <%= paginate @posts %>
<% else %>
  <p class="empty">لا توجد مقالات بعد.</p>
<% end %>
`.trim() },
    { t: 'code', lang: 'html', code: `
<%# app/views/posts/_post_card.html.erb %>
<article class="card">
  <h2><%= link_to post.title, post %></h2>

  <div class="meta">
    <%= post.user.name %> ·
    <%= l post.created_at, format: :short %> ·
    <%= post.reading_minutes %> دقائق قراءة
  </div>

  <p><%= post.excerpt %></p>

  <% if post.user == current_user %>
    <%= link_to "تعديل", edit_post_path(post) %>
    <%= button_to "حذف", post, method: :delete,
                  form: { data: { turbo_confirm: "متأكّد؟" } } %>
  <% end %>
</article>
`.trim() },
    { t: 'code', lang: 'html', code: `
<%# app/views/posts/_form.html.erb %>
<%= form_with model: post do |f| %>
  <% if post.errors.any? %>
    <div class="errors">
      <h3>تعذّر الحفظ:</h3>
      <ul>
        <% post.errors.full_messages.each do |msg| %>
          <li><%= msg %></li>
        <% end %>
      </ul>
    </div>
  <% end %>

  <div class="field">
    <%= f.label :title, "العنوان" %>
    <%= f.text_field :title, required: true %>
  </div>

  <div class="field">
    <%= f.label :body, "المحتوى" %>
    <%= f.text_area :body, rows: 14 %>
  </div>

  <div class="field">
    <%= f.check_box :published %>
    <%= f.label :published, "نشر فوراً" %>
  </div>

  <%= f.submit class: "btn" %>
<% end %>
`.trim() },
    { t: 'warn', title: 'الهروب التلقائي', text: 'يهرّب Rails كل مخرجات `<%= %>` تلقائياً لمنع ثغرات XSS. لا تستخدم `raw` أو `html_safe` على محتوى من المستخدم أبداً — إن احتجت HTML من المستخدم، نظّفه بـ `sanitize` بقائمة وسوم مسموحة.' },

    { t: 'h2', text: 'المصادقة' },
    { t: 'code', lang: 'ruby', code: `
# Gemfile
gem "bcrypt", "~> 3.1"

# النموذج
class User < ApplicationRecord
  has_secure_password           # يوفّر password و password_confirmation و authenticate

  validates :email, presence: true, uniqueness: { case_sensitive: false }
  validates :password, length: { minimum: 8 }, if: -> { password.present? }

  normalizes :email, with: ->(e) { e.strip.downcase }
end

# المتحكّم
class SessionsController < ApplicationController
  def new; end

  def create
    user = User.find_by(email: params[:email].to_s.downcase)

    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to root_path, notice: "أهلاً بعودتك يا #{user.name}!"
    else
      flash.now[:alert] = "البريد أو كلمة المرور غير صحيحة."
      render :new, status: :unprocessable_entity
    end
  end

  def destroy
    session.delete(:user_id)
    redirect_to root_path, notice: "تمّ تسجيل الخروج.", status: :see_other
  end
end

# ApplicationController
class ApplicationController < ActionController::Base
  helper_method :current_user, :logged_in?

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def logged_in? = current_user.present?

  def require_login
    redirect_to new_session_path, alert: "سجّل الدخول أولاً." unless logged_in?
  end
end
`.trim() },
    { t: 'note', text: '`has_secure_password` يخزّن تجزئة bcrypt في العمود `password_digest` — لا تخزّن كلمة المرور نصّاً صريحاً أبداً تحت أي ظرف.' },

    { t: 'h2', text: 'المشروع: مدوّنة كاملة' },
    { t: 'exercise',
      title: 'مدوّنة Rails متكاملة',
      brief: 'ابنِ مدوّنة كاملة بمستخدمين ومقالات وتعليقات ووسوم وبحث ولوحة إدارة، مع اختبارات ونشر.',
      requirements: [
        '**النماذج**: `User` (اسم، بريد، كلمة مرور، نبذة، دور)، `Post` (عنوان، محتوى، منشور، صورة غلاف)، `Comment`، `Tag` مع جدول وسيط `Tagging`.',
        '**العلاقات**: مستخدم ← مقالات وتعليقات، مقال ← تعليقات ووسوم (متعدّد لمتعدّد)، تعليق ← مستخدم ومقال.',
        '**المصادقة**: تسجيل وتسجيل دخول وخروج بـ `has_secure_password`، مع تذكّر الجلسة.',
        '**الصلاحيات**: صاحب المقال فقط يعدّل ويحذف، والمشرف يستطيع إدارة كل شيء.',
        '**CRUD كامل** للمقالات مع نطاقات: `published`, `drafts`, `recent`, `popular`.',
        '**التعليقات**: إضافة وحذف مع تحديث فوري (Turbo Streams إن أمكن).',
        '**الوسوم**: اختيار متعدّد في النموذج، وصفحة `/tags/:name` تعرض مقالات الوسم.',
        '**البحث**: في العنوان والمحتوى مع ترقيم صفحات.',
        '**لوحة الإدارة** في `namespace :admin` بإحصاءات: عدد المستخدمين والمقالات والتعليقات، وأكثر الكتّاب نشاطاً.',
        '**الأداء**: استخدم `includes` في كل صفحة تعرض علاقات — لا تترك أي N+1.',
        '**التحقّق**: على كل الحقول مع رسائل خطأ عربية واضحة تُعرض في النموذج.',
        '**البذور**: `seeds.rb` ينشئ 5 مستخدمين و 30 مقالاً و 100 تعليق و 10 وسوم ببيانات واقعية.',
        '**الاختبارات**: نماذج (تحقّق وعلاقات ونطاقات) ومتحكّمات (صلاحيات ومسارات فاشلة).',
        '**الأمان**: معاملات قوية في كل متحكّم، ولا `html_safe` على محتوى المستخدم.'
      ],
      hints: [
        '`bin/rails g scaffold Post title:string body:text` يولّد كل شيء دفعة واحدة كنقطة بداية.',
        '`has_many :tags, through: :taggings` مع `accepts_nested_attributes_for` أو `tag_ids: []` في المعاملات.',
        '`gem "kaminari"` لترقيم الصفحات، و`gem "faker"` لبيانات البذور.',
        '`Post.joins(:comments).group("posts.id").order("COUNT(comments.id) DESC")` لأكثر المقالات تعليقاً.',
        '`gem "bullet"` في مجموعة development يحذّرك من كل N+1 تلقائياً.'
      ],
      solution: { lang: 'ruby', code: `
# ═══════════════════════════════════════════════════
# 1) الإعداد
# ═══════════════════════════════════════════════════
# rails new blog --database=postgresql --css=tailwind
# cd blog
#
# Gemfile:
#   gem "bcrypt", "~> 3.1"
#   gem "kaminari"
#   group :development do
#     gem "bullet"
#   end
#   group :development, :test do
#     gem "rspec-rails"
#     gem "factory_bot_rails"
#     gem "faker"
#   end
#
# bin/rails g rspec:install
# bin/rails db:create

# ═══════════════════════════════════════════════════
# 2) الهجرات
# ═══════════════════════════════════════════════════
class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :name,            null: false
      t.string :email,           null: false
      t.string :password_digest, null: false
      t.text   :bio
      t.string :role, null: false, default: "author"
      t.timestamps
    end
    add_index :users, :email, unique: true
  end
end

class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.references :user, null: false, foreign_key: true
      t.string   :title, null: false
      t.text     :body,  null: false
      t.boolean  :published, null: false, default: false
      t.datetime :published_at
      t.integer  :views_count, null: false, default: 0
      t.timestamps
    end
    add_index :posts, :published
    add_index :posts, %i[user_id created_at]
  end
end

class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true
      t.text :body, null: false
      t.timestamps
    end
  end
end

class CreateTags < ActiveRecord::Migration[7.1]
  def change
    create_table :tags do |t|
      t.string :name, null: false
      t.timestamps
    end
    add_index :tags, :name, unique: true

    create_table :taggings do |t|
      t.references :post, null: false, foreign_key: true
      t.references :tag,  null: false, foreign_key: true
      t.timestamps
    end
    add_index :taggings, %i[post_id tag_id], unique: true
  end
end

# ═══════════════════════════════════════════════════
# 3) النماذج
# ═══════════════════════════════════════════════════
# app/models/user.rb
class User < ApplicationRecord
  has_secure_password

  has_many :posts,    dependent: :destroy
  has_many :comments, dependent: :destroy

  ROLES = %w[author admin].freeze

  normalizes :email, with: ->(e) { e.to_s.strip.downcase }

  validates :name,  presence: true, length: { in: 2..60 }
  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP, message: "بصيغة غير صحيحة" }
  validates :password, length: { minimum: 8 }, if: -> { password.present? }
  validates :role, inclusion: { in: ROLES }
  validates :bio, length: { maximum: 400 }, allow_blank: true

  scope :authors, -> { where(role: "author") }
  scope :most_active, -> {
    left_joins(:posts).group(:id).order(Arel.sql("COUNT(posts.id) DESC"))
  }

  def admin? = role == "admin"
  def to_s   = name
end

# app/models/post.rb
class Post < ApplicationRecord
  belongs_to :user
  has_many :comments, dependent: :destroy
  has_many :taggings, dependent: :destroy
  has_many :tags, through: :taggings

  validates :title, presence: true, length: { in: 5..120 }
  validates :body,  presence: true, length: { minimum: 20 }

  scope :published, -> { where(published: true) }
  scope :drafts,    -> { where(published: false) }
  scope :recent,    -> { order(created_at: :desc) }
  scope :popular,   -> {
    left_joins(:comments).group(:id).order(Arel.sql("COUNT(comments.id) DESC"))
  }
  scope :search, ->(q) {
    return all if q.blank?
    where("title ILIKE :q OR body ILIKE :q", q: "%#{q}%")
  }
  scope :tagged_with, ->(name) { joins(:tags).where(tags: { name: }) }

  before_save :stamp_published_at

  def excerpt(length = 180) = body.to_s.truncate(length)
  def reading_minutes = [(body.to_s.split.size / 200.0).ceil, 1].max
  def owned_by?(other) = user_id == other&.id

  private

  def stamp_published_at
    self.published_at ||= Time.current if published?
  end
end

# app/models/comment.rb
class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :post

  validates :body, presence: true, length: { in: 2..2000 }

  scope :recent, -> { order(created_at: :desc) }

  def owned_by?(other) = user_id == other&.id
end

# app/models/tag.rb
class Tag < ApplicationRecord
  has_many :taggings, dependent: :destroy
  has_many :posts, through: :taggings

  normalizes :name, with: ->(n) { n.to_s.strip.downcase }

  validates :name, presence: true, uniqueness: true, length: { in: 2..30 }

  scope :popular, -> {
    left_joins(:posts).group(:id).order(Arel.sql("COUNT(posts.id) DESC"))
  }

  def to_s = name
end

# ═══════════════════════════════════════════════════
# 4) المسارات
# ═══════════════════════════════════════════════════
Rails.application.routes.draw do
  root "posts#index"

  resources :posts do
    resources :comments, only: %i[create destroy]
    member     { patch :publish }
    collection { get :drafts }
  end

  resources :tags, only: %i[index show], param: :name
  resources :users, only: %i[new create show]
  resource  :session, only: %i[new create destroy]

  namespace :admin do
    root "dashboard#index"
    resources :posts, only: %i[index destroy]
    resources :users, only: %i[index destroy]
  end
end

# ═══════════════════════════════════════════════════
# 5) المتحكّمات
# ═══════════════════════════════════════════════════
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  helper_method :current_user, :logged_in?

  rescue_from ActiveRecord::RecordNotFound do
    redirect_to root_path, alert: "الصفحة المطلوبة غير موجودة."
  end

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def logged_in? = current_user.present?

  def require_login
    return if logged_in?
    redirect_to new_session_path, alert: "سجّل الدخول للمتابعة."
  end

  def require_admin
    return if current_user&.admin?
    redirect_to root_path, alert: "هذه الصفحة للمشرفين فقط."
  end
end

# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  before_action :require_login, except: %i[index show]
  before_action :set_post,      only: %i[show edit update destroy publish]
  before_action :authorize!,    only: %i[edit update destroy publish]

  def index
    @posts = Post.published
                 .includes(:user, :tags)
                 .search(params[:q])
                 .recent
                 .page(params[:page]).per(9)
    @popular_tags = Tag.popular.limit(12)
  end

  def drafts
    @posts = current_user.posts.drafts.includes(:tags).recent.page(params[:page])
  end

  def show
    @post.increment!(:views_count)
    @comments = @post.comments.includes(:user).recent
    @comment  = Comment.new
    @related  = Post.published.tagged_with(@post.tags.first&.name)
                    .where.not(id: @post.id).includes(:user).limit(3)
  end

  def new  = @post = current_user.posts.build
  def edit; end

  def create
    @post = current_user.posts.build(post_params)

    if @post.save
      redirect_to @post, notice: "نُشِر المقال بنجاح."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @post.update(post_params)
      redirect_to @post, notice: "حُدِّث المقال."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @post.destroy
    redirect_to posts_path, notice: "حُذِف المقال.", status: :see_other
  end

  def publish
    @post.update!(published: true)
    redirect_to @post, notice: "أصبح المقال منشوراً."
  end

  private

  def set_post = @post = Post.includes(:user, :tags).find(params[:id])

  def authorize!
    return if @post.owned_by?(current_user) || current_user.admin?
    redirect_to posts_path, alert: "غير مصرّح لك بهذا الإجراء."
  end

  def post_params
    params.require(:post).permit(:title, :body, :published, tag_ids: [])
  end
end

# app/controllers/comments_controller.rb
class CommentsController < ApplicationController
  before_action :require_login

  def create
    @post    = Post.find(params[:post_id])
    @comment = @post.comments.build(comment_params.merge(user: current_user))

    if @comment.save
      redirect_to @post, notice: "أُضيف تعليقك."
    else
      redirect_to @post, alert: @comment.errors.full_messages.to_sentence
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    unless @comment.owned_by?(current_user) || current_user.admin?
      return redirect_to @comment.post, alert: "غير مصرّح."
    end

    post = @comment.post
    @comment.destroy
    redirect_to post, notice: "حُذِف التعليق.", status: :see_other
  end

  private

  def comment_params = params.require(:comment).permit(:body)
end

# app/controllers/admin/dashboard_controller.rb
module Admin
  class DashboardController < ApplicationController
    before_action :require_login
    before_action :require_admin

    def index
      @stats = {
        users:      User.count,
        posts:      Post.count,
        published:  Post.published.count,
        drafts:     Post.drafts.count,
        comments:   Comment.count,
        tags:       Tag.count
      }
      @top_authors = User.most_active.limit(5)
      @top_posts   = Post.published.popular.includes(:user).limit(5)
      @recent      = Comment.includes(:user, :post).recent.limit(10)
    end
  end
end

# ═══════════════════════════════════════════════════
# 6) البذور — db/seeds.rb
# ═══════════════════════════════════════════════════
require "faker"
Faker::Config.locale = "ar"

Tagging.destroy_all
Comment.destroy_all
Post.destroy_all
Tag.destroy_all
User.destroy_all

admin = User.create!(
  name: "المشرف", email: "admin@blog.test",
  password: "password123", role: "admin",
  bio: "مسؤول المنصّة"
)

authors = 5.times.map do |i|
  User.create!(
    name: Faker::Name.name,
    email: "author#{i + 1}@blog.test",
    password: "password123",
    bio: Faker::Lorem.paragraph(sentence_count: 2)
  )
end

tags = %w[ruby rails برمجة تصميم قواعد-بيانات أمان أداء تعلّم-آلة واجهات مصادر]
       .map { |name| Tag.create!(name:) }

30.times do
  post = Post.create!(
    user:      authors.sample,
    title:     Faker::Lorem.sentence(word_count: 5).chomp("."),
    body:      Faker::Lorem.paragraphs(number: rand(4..9)).join("\\n\\n"),
    published: [true, true, true, false].sample,
    created_at: rand(90).days.ago
  )
  post.tags = tags.sample(rand(1..3))
end

posts = Post.published.to_a
100.times do
  Comment.create!(
    user: (authors + [admin]).sample,
    post: posts.sample,
    body: Faker::Lorem.sentence(word_count: rand(6..20)),
    created_at: rand(60).days.ago
  )
end

puts "✅ #{User.count} مستخدمين، #{Post.count} مقالاً، " \\
     "#{Comment.count} تعليقاً، #{Tag.count} وسماً."

# ═══════════════════════════════════════════════════
# 7) الاختبارات — spec/models/post_spec.rb
# ═══════════════════════════════════════════════════
require "rails_helper"

RSpec.describe Post do
  let(:user) { User.create!(name: "كاتب", email: "a@b.test", password: "password123") }

  def build_post(**attrs)
    described_class.new({ user:, title: "عنوان صالح", body: "محتوى طويل بما يكفي للتحقّق." }.merge(attrs))
  end

  describe "التحقّق" do
    it "يقبل مقالاً صحيحاً" do
      expect(build_post).to be_valid
    end

    it "يرفض العنوان الفارغ" do
      post = build_post(title: "")
      expect(post).not_to be_valid
      expect(post.errors[:title]).to be_present
    end

    it "يرفض العنوان القصير" do
      expect(build_post(title: "قصير")).not_to be_valid
    end

    it "يرفض المحتوى القصير" do
      expect(build_post(body: "قصير")).not_to be_valid
    end
  end

  describe "العلاقات" do
    it "ينتمي لمستخدم" do
      expect(build_post.user).to eq(user)
    end

    it "يحذف تعليقاته عند حذفه" do
      post = build_post(published: true)
      post.save!
      post.comments.create!(user:, body: "تعليق")

      expect { post.destroy }.to change(Comment, :count).by(-1)
    end
  end

  describe "النطاقات" do
    before do
      build_post(published: true).save!
      build_post(published: false).save!
    end

    it ".published يُرجع المنشورة فقط" do
      expect(described_class.published.count).to eq(1)
    end

    it ".drafts يُرجع المسوّدات فقط" do
      expect(described_class.drafts.count).to eq(1)
    end

    it ".search يطابق العنوان" do
      expect(described_class.search("عنوان").count).to eq(2)
      expect(described_class.search("لا-يوجد").count).to eq(0)
    end

    it ".search يُرجع الكل عند بحث فارغ" do
      expect(described_class.search("").count).to eq(2)
    end
  end

  describe "#stamp_published_at" do
    it "يضبط published_at عند النشر" do
      post = build_post(published: true)
      post.save!
      expect(post.published_at).to be_present
    end

    it "يتركه فارغاً للمسوّدة" do
      post = build_post(published: false)
      post.save!
      expect(post.published_at).to be_nil
    end
  end

  describe "#reading_minutes" do
    it "يُرجع دقيقة على الأقل" do
      expect(build_post.reading_minutes).to be >= 1
    end
  end
end

# ═══════════════════════════════════════════════════
# spec/requests/posts_spec.rb
# ═══════════════════════════════════════════════════
require "rails_helper"

RSpec.describe "Posts" do
  let(:owner)   { User.create!(name: "المالك",  email: "o@b.test", password: "password123") }
  let(:hacker)  { User.create!(name: "متطفّل", email: "h@b.test", password: "password123") }
  let(:post_record) do
    Post.create!(user: owner, title: "عنوان المقال", body: "محتوى طويل للاختبار.", published: true)
  end

  def sign_in(user)
    post session_path, params: { email: user.email, password: "password123" }
  end

  describe "GET /posts" do
    it "يعمل بلا تسجيل دخول" do
      get posts_path
      expect(response).to have_http_status(:ok)
    end
  end

  describe "GET /posts/new" do
    it "يعيد التوجيه للزائر" do
      get new_post_path
      expect(response).to redirect_to(new_session_path)
    end

    it "يعمل للمسجَّل" do
      sign_in(owner)
      get new_post_path
      expect(response).to have_http_status(:ok)
    end
  end

  describe "PATCH /posts/:id" do
    it "يمنع غير المالك" do
      sign_in(hacker)
      patch post_path(post_record), params: { post: { title: "عنوان مخترَق" } }

      expect(response).to redirect_to(posts_path)
      expect(post_record.reload.title).to eq("عنوان المقال")
    end

    it "يسمح للمالك" do
      sign_in(owner)
      patch post_path(post_record), params: { post: { title: "عنوان محدَّث" } }

      expect(post_record.reload.title).to eq("عنوان محدَّث")
    end
  end

  describe "DELETE /posts/:id" do
    it "يمنع غير المالك" do
      sign_in(hacker)
      expect { delete post_path(post_record) }.not_to change(Post, :count)
    end

    it "يسمح للمالك" do
      sign_in(owner)
      post_record
      expect { delete post_path(post_record) }.to change(Post, :count).by(-1)
    end
  end
end

# ═══════════════════════════════════════════════════
# 8) النشر
# ═══════════════════════════════════════════════════
# bin/rails db:migrate db:seed
# bin/rails s
#
# للإنتاج:
#   RAILS_ENV=production bin/rails assets:precompile
#   RAILS_ENV=production bin/rails db:migrate
#   bin/rails credentials:edit   # ضع الأسرار هنا لا في الشيفرة
#
# خيارات الاستضافة: Render, Fly.io, Hatchbox, Heroku
`.trim() }
    },

    { t: 'h2', text: 'إلى أين بعد ذلك؟' },
    { t: 'steps', items: [
      '**عمّق Active Record**: الاستعلامات المتقدّمة، الفهارس، وتحسين الأداء.',
      '**Hotwire**: Turbo و Stimulus لتفاعل غنيّ بلا إطار JavaScript كامل.',
      '**كائنات الخدمة**: انقل المنطق المعقّد خارج المتحكّمات والنماذج.',
      '**المهام الخلفية**: Active Job مع Sidekiq للبريد والمعالجة الثقيلة.',
      '**واجهات برمجية**: `rails new --api` مع JSON Serializers.',
      '**النشر**: Kamal أو Render أو Fly.io مع CI/CD.',
      '**الأمان**: اقرأ دليل Rails Security كاملاً — إنه قصير ويستحقّ ذلك.'
    ]},
    { t: 'tip', text: 'أفضل مصدر بعد هذا المسار هو **Rails Guides** الرسمي على `guides.rubyonrails.org`. مكتوب بعناية ويغطّي كل ما تحتاجه بأمثلة عملية.' },

    { t: 'h2', text: 'اختبر نفسك' },
    { t: 'quiz', items: [
      { q: 'ما معنى «الاتفاق قبل الإعداد»؟', options: ['ملفات إعداد أقلّ حجماً', 'اتّباع تسمية متوقّعة يجعل كل شيء يعمل بلا إعداد يدوي', 'إعدادات افتراضية قابلة للتغيير', 'لا إعدادات إطلاقاً'], answer: 1,
        explain: 'جدول `posts` ← نموذج `Post` ← متحكّم `PostsController` ← مجلّد `views/posts` — كلها مربوطة تلقائياً.' },
      { q: 'ما مشكلة N+1 وكيف تحلّها؟', options: ['بطء الشبكة', 'استعلام إضافي لكل صفّ عند الوصول لعلاقة — تُحلّ بـ `includes`', 'خطأ في الفهارس', 'مشكلة ذاكرة'], answer: 1,
        explain: '`Post.includes(:user)` ينفّذ استعلامين بدل 51، والفرق يتضاعف مع حجم البيانات.' },
      { q: 'لماذا المعاملات القوية (`permit`) ضرورية؟', options: ['للأداء', 'تمنع المهاجم من تعديل حقول لم تسمح بها عبر إرسال معاملات إضافية', 'للتنسيق', 'إلزامية صياغياً'], answer: 1,
        explain: 'بدونها يستطيع أحدهم إرسال `post[user_id]=1` أو `user[role]=admin` في النموذج.' },
      { q: 'كم مساراً يولّد `resources :posts`؟', options: ['4', '7 مسارات RESTful', '3', '10'], answer: 1,
        explain: 'index و new و create و show و edit و update و destroy.' },
      { q: 'ما وظيفة `has_secure_password`؟', options: ['يشفّر قاعدة البيانات', 'يوفّر `password` و `authenticate` ويخزّن تجزئة bcrypt في `password_digest`', 'يولّد كلمات مرور', 'يتحقّق من القوّة'], answer: 1,
        explain: 'يتطلّب عمود `password_digest` و gem `bcrypt`. لا تخزّن كلمة المرور نصّاً صريحاً أبداً.' },
      { q: 'لماذا لا تعدّل هجرة طُبِّقت على الإنتاج؟', options: ['ممنوع تقنياً', 'ستختلف قاعدة بيانات الإنتاج عن الشيفرة بلا أن ينبّهك شيء', 'بطيء', 'يفسد schema.rb فقط'], answer: 1,
        explain: 'اكتب هجرة جديدة دائماً — التاريخ يجب أن يبقى قابلاً للتكرار من الصفر.' },
      { q: 'ما فائدة النطاقات (scopes) في النموذج؟', options: ['أسرع', 'تسمّي استعلاماً متكرّراً وتجعله قابلاً للتسلسل مع غيره', 'تحلّ محلّ الفهارس', 'للأمان'], answer: 1,
        explain: '`Post.published.recent.search(q)` — كل نطاق يُرجع علاقة قابلة للتسلسل مع التالي.' }
    ]}
  ]
};
