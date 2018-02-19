<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\{Request, Response};
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Form\Extension\Core\Type\{TextType, SubmitType};
use App\Entity\Role;

class RoleController extends AbstractController{

  /**
   * @Route("/superadmin/role", name="role")
   */
  public function role():Response{
    $em = $this->getDoctrine()->getRepository(Role::class);

    $roles = $em->findAll();

    return $this->render('role/index.html.twig', [
      'roles' => $roles
    ]);
  }

  /**
   * @Route("/superadmin/role/add", name="add_role")
   */
  public function addRole(Request $request):Response{
    $role = new Role();

    $form = $this->createFormBuilder($role)
      ->add('name', TextType::class)
      ->add('save', SubmitType::class, array('label' => 'Ajouter'))
      ->getForm();

    $form->handleRequest($request);

    if($form->isSubmitted() && $form->isValid()){
      // $form->getData() holds the submitted values
      // but, the original `$task` variable has also been updated
      $role = $form->getData();

      // ... perform some action, such as saving the task to the database
      // for example, if Task is a Doctrine entity, save it!
      $em = $this->getDoctrine()->getManager();
      $em->persist($role);
      $em->flush();

      return $this->redirectToRoute('role');
    }

    return $this->render('role/add.html.twig', [
      'form' => $form->createView(),
      'role' => $role
    ]);
  }

  /**
   * @Route("/superadmin/role/edit/{role}", name="edit_role")
   */
  public function editRole(Request $request, Role $role):Response{

    $form = $this->createFormBuilder($role)
      ->add('name', TextType::class)
      ->add('save', SubmitType::class, array('label' => 'Ajouter'))
      ->getForm();

    $form->handleRequest($request);

    if($form->isSubmitted() && $form->isValid()){
      // $form->getData() holds the submitted values
      // but, the original `$task` variable has also been updated
      $role = $form->getData();

      // ... perform some action, such as saving the task to the database
      // for example, if Task is a Doctrine entity, save it!
      $em = $this->getDoctrine()->getManager();
      $em->persist($role);
      $em->flush();

      return $this->redirectToRoute('role');
    }

    return $this->render('role/edit.html.twig', [
      'form' => $form->createView(),
      'role' => $role
    ]);
  }
}
