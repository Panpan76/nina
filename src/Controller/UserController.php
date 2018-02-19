<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

use App\Entity\User;
use App\Entity\Role;
use App\Entity\Entity;
use App\Entity\Service;
use App\Entity\MarketLine;

class UserController extends Controller
{

  /**
   * @Route("/superadmin/user", name="user")
   */
    public function user()
    {
        $em = $this->getDoctrine()->getRepository(User::class);

        $users = $em->findAll();

        return $this->render('user/index.html.twig', [
      'users' => $users
    ]);
    }

    /**
     * @Route("/superadmin/user/add", name="add_user")
     */
    public function addUser(Request $request)
    {
        $user = new User();

        $doctrine = $this->getDoctrine();

        $form = $this->createFormBuilder($user)
      ->add('firstname', TextType::class)
      ->add('lastname', TextType::class)
      ->add('username', TextType::class)
      ->add('email', EmailType::class)
      ->add('password', PasswordType::class)
      ->add('roles', ChoiceType::class, array(
        'choices' => $doctrine->getRepository(Role::class)->findAll(),
        'multiple' => false,
        'expanded' => false,
        'choice_label' => function ($role) {
            return $role->getName();
        }
      ))
      ->add('entity', EntityType::class, array(
        'class' => Entity::class,
        'multiple' => false,
        'expanded' => false,
        'choice_label' => 'name',
        'required' => false
      ))
      ->add('save', SubmitType::class, array('label' => 'Ajouter'))
      ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user = $form->getData();

            $user->setPassword(password_hash($user->getPassword(), PASSWORD_BCRYPT));

            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            return $this->redirectToRoute('user');
        }

        return $this->render('user/add.html.twig', [
      'form' => $form->createView(),
      'user' => $user
    ]);
    }


    /**
     * @Route("/superadmin/user/edit/{user}", name="edit_user")
     */
    public function editUser(Request $request, User $user)
    {
        $doctrine = $this->getDoctrine();

        $form = $this->createFormBuilder($user)
      ->add('firstname', TextType::class)
      ->add('lastname', TextType::class)
      ->add('username', TextType::class)
      ->add('email', EmailType::class)
      ->add('roles', ChoiceType::class, array(
        'choices' => $doctrine->getRepository(Role::class)->findAll(),
        'multiple' => false,
        'expanded' => false,
        'choice_label' => function ($role) {
            return $role->getName();
        },
        'choice_attr' => function ($role) use ($user) {
            return ['selected' => in_array($role->getRole(), $user->getRoles())];
        }
      ))
      ->add('entity', EntityType::class, array(
        'class' => Entity::class,
        'multiple' => false,
        'expanded' => false,
        'choice_label' => 'name',
        'required' => false
      ))
      ->add('save', SubmitType::class, array('label' => 'Ajouter'))
      ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user = $form->getData();

            $em = $this->getDoctrine()->getManager();
            $em->persist($user);
            $em->flush();

            return $this->redirectToRoute('user');
        }

        return $this->render('user/edit.html.twig', [
            'form' => $form->createView(),
            'user' => $user
        ]);
    }


    /**
     * @Route("/superadmin/user/edit/{user}/services/marketlines", name="set_user_services_marketlines")
     */
    public function setUserServicesMarketLines(Request $request, User $user)
    {
        $doctrine = $this->getDoctrine();

        $services    = $doctrine->getRepository(Service::class)->findBy(['entity' => $user->getEntity()]);
        $marketLines = [];
        foreach ($services as $service) {
            $marketLines[$service->getName()] = $doctrine->getRepository(MarketLine::class)->findBy(['service' => $service]);
        }

        $form = $this->createFormBuilder($user)
      ->add('marketlines', EntityType::class, array(
        'class' => MarketLine::class,
        'choices' => $marketLines,
        'multiple' => true,
        'expanded' => false,
        'choice_label' => 'name',
        'required' => false
      ))
      ->add('save', SubmitType::class, array('label' => 'Affecter'))
      ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $user = $form->getData();

            $user->setServices([]);
            foreach ($user->getMarketLines() as $marketLine) {
                if (!in_array($marketLine->getService(), $user->getServices())) {
                    $user->addService($marketLine->getService());
                }
            }

            $em = $doctrine->getManager();
            $em->persist($user);
            $em->flush();

            return $this->redirectToRoute('user');
        }

        return $this->render('user/set_user_services_marketlines.html.twig', [
      'form' => $form->createView(),
      'user' => $user
    ]);
    }
}
