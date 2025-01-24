;;; package --- Summary
;;; Commentary:

;;; Code:
;; adds melpa-stable to the list of repos
(require 'package)
(setq package-archives '(("melpa-stable" . "https://stable.melpa.org/packages/")
			 ("melpa", "https://melpa.org/packages/")
			 ("gnu" . "https://elpa.gnu.org/packages/")
			 ("org" . "https://orgmode.org/elpa/")))
(add-to-list 'package-directory-list "/Users/puhari2001/.emacs.d/manual-packages/")
(package-initialize)

;; remove menu bar
(menu-bar-mode -1)

;; python-mode v split to a file
(use-package python-mode
  :ensure t
  :hook (python-mode . (lambda ()
                         (setq tab-width 2)
                         (setq python-indent-offset 2)
                         (setq indent-tabs-mode nil))))

(use-package typescript-mode
  :ensure t
  :hook (typescript-mode . (lambda ()
                             (setq tab-width 2)
                             (setq typescript-indent-level 2)
                             (setq indent-tabs-mode nil))))

(use-package dockerfile-mode
  :ensure t)

(use-package docker-compose-mode
  :ensure t)

;; flycheck mode
;; load after lsp-mode
(use-package flycheck
  :ensure t
  :after (lsp-mode)
  :init
  (global-flycheck-mode))

;; reformatter helps to define custom format for files
;; this is used to thread prettier formatter to the files
;; use this package to thread all file formatters in future
(use-package reformatter
  :ensure t)

;;; this is a macro that constructs the functions
;;; prettier-format-buffer and prettier-format-region
(reformatter-define  prettier-format
		     :program "prettier"
		     :args (list "--stdin-filepath" (or buffer-file-name ""))
		     :stdin t)

;; lsp-mode installation
;; disabling lsp checker with diagnostics
(use-package lsp-mode
  :config
  (setq lsp-prefer-flymake nil)
  :ensure t
  :hook ((typescript-mode . lsp)
	 (typescript-mode . (lambda () (add-hook 'before-save-hook #'prettier-format-buffer nil t)))
	 (java-mode . lsp)
	 (python-mode . lsp)
         (js-mode . lsp)
         (js2-mode . lsp)
         (web-mode . lsp))
  :commands lsp)

;; lsp-java has lsp-docker dependency
;; which is not available in repos any more
;; (use-package lsp-java
;;   :ensure t
;;   :config (add-hook 'java-mode-hook 'lsp))


;; add flycheck as the diagnostics provider
;; we are disable all lsp-formatting in the buffer
;; this is going to effect other languages
(with-eval-after-load 'lsp-mode
  (setq lsp-clients-typescript-format-options nil)  ;; disable typescript formatting
  (setq lsp-enable-on-type-formatting nil)
  (setq lsp-enable-indentation nil)
  (setq lsp-enable-format-on-save nil)
  (setq lsp-diagnostics-provider :flycheck))

(use-package lsp-ui
  :ensure t
  :commands lsp-ui-mode
  :config
  (setq lsp-ui-sideline-enable t
	lsp-ui-sideline-show-diagnostics t))

(use-package company
  :ensure t
  :config
  (add-hook 'after-init-hook 'global-company-mode))


;; installing microsoft server
;; lsp-pyright-venv-path is where emacs will look
;; for virtual envs
(use-package lsp-pyright
  :ensure t
  :hook (python-mode . (lambda ()
			 (require 'lsp-pyright)
			 (setq lsp-pyright-use-library-code-for-types t)
			 (lsp))) ;or lsp-deferred
  :config
  (setq lsp-pyright-auto-import-completions t
	lsp-pyright-disable-organize-imports nil
	lsp-pyright-multi-root nil
	lsp-pyright-venv-path "~/my_venvs"))

;; theme
(use-package gruvbox-theme
  :ensure t
  :config
  (load-theme 'gruvbox-dark-medium t))
;; (load-theme 'manoj-dark)

;; fido-vertical-mode
(fido-vertical-mode)

;; KEY BINDINGS
(global-set-key (kbd "M-p") 'previous-buffer)
(global-set-key (kbd "M-n") 'next-buffer)


(custom-set-variables
 ;; custom-set-variables was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 '(connection-local-criteria-alist
   '(((:application eshell)
      eshell-connection-default-profile)
     ((:application tramp :machine "localhost")
      tramp-connection-local-darwin-ps-profile)
     ((:application tramp :machine "hareeshs-MacBook-Pro.local")
      tramp-connection-local-darwin-ps-profile)
     ((:application tramp)
      tramp-connection-local-default-system-profile tramp-connection-local-default-shell-profile)))
 '(connection-local-profile-alist
   '((eshell-connection-default-profile
      (eshell-path-env-list))
     (tramp-connection-local-darwin-ps-profile
      (tramp-process-attributes-ps-args "-acxww" "-o" "pid,uid,user,gid,comm=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" "-o" "state=abcde" "-o" "ppid,pgid,sess,tty,tpgid,minflt,majflt,time,pri,nice,vsz,rss,etime,pcpu,pmem,args")
      (tramp-process-attributes-ps-format
       (pid . number)
       (euid . number)
       (user . string)
       (egid . number)
       (comm . 52)
       (state . 5)
       (ppid . number)
       (pgrp . number)
       (sess . number)
       (ttname . string)
       (tpgid . number)
       (minflt . number)
       (majflt . number)
       (time . tramp-ps-time)
       (pri . number)
       (nice . number)
       (vsize . number)
       (rss . number)
       (etime . tramp-ps-time)
       (pcpu . number)
       (pmem . number)
       (args)))
     (tramp-connection-local-busybox-ps-profile
      (tramp-process-attributes-ps-args "-o" "pid,user,group,comm=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" "-o" "stat=abcde" "-o" "ppid,pgid,tty,time,nice,etime,args")
      (tramp-process-attributes-ps-format
       (pid . number)
       (user . string)
       (group . string)
       (comm . 52)
       (state . 5)
       (ppid . number)
       (pgrp . number)
       (ttname . string)
       (time . tramp-ps-time)
       (nice . number)
       (etime . tramp-ps-time)
       (args)))
     (tramp-connection-local-bsd-ps-profile
      (tramp-process-attributes-ps-args "-acxww" "-o" "pid,euid,user,egid,egroup,comm=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" "-o" "state,ppid,pgid,sid,tty,tpgid,minflt,majflt,time,pri,nice,vsz,rss,etimes,pcpu,pmem,args")
      (tramp-process-attributes-ps-format
       (pid . number)
       (euid . number)
       (user . string)
       (egid . number)
       (group . string)
       (comm . 52)
       (state . string)
       (ppid . number)
       (pgrp . number)
       (sess . number)
       (ttname . string)
       (tpgid . number)
       (minflt . number)
       (majflt . number)
       (time . tramp-ps-time)
       (pri . number)
       (nice . number)
       (vsize . number)
       (rss . number)
       (etime . number)
       (pcpu . number)
       (pmem . number)
       (args)))
     (tramp-connection-local-default-shell-profile
      (shell-file-name . "/bin/sh")
      (shell-command-switch . "-c"))
     (tramp-connection-local-default-system-profile
      (path-separator . ":")
      (null-device . "/dev/null"))))
 '(package-selected-packages
   '(dap-ui posframe docker-compose-mode lsp-docker dap-mode lsp-java flycheck dockerfile-mode yaml-mode add-node-modules-path Corfu-doc corfu-doc corfu-doc-terminal corfu-terminal company lsp-mode python-mode)))
(custom-set-faces
 ;; custom-set-faces was added by Custom.
 ;; If you edit it by hand, you could mess it up, so be careful.
 ;; Your init file should contain only one such instance.
 ;; If there is more than one, they won't work right.
 )
